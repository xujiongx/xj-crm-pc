import config from '@aicc/config';
import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { uid } from '@aicc/shared';
import { UserInfoType } from '@aicc/types';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useSetState } from 'ahooks';
import { FC, ReactNode, createContext, useContext, useState } from 'react';
import { InteractionRespond, MessageItem } from '../interface';

const ChatContext = createContext<
  | {
      status: { loading: boolean; end: boolean };
      message: MessageItem[];
      onClear: () => void;
      onSend: (data: {
        query: string;
        breakTts: '0' | '1';
        userId: string;
        startRobotNodeID?: string;
      }) => void;
    }
  | undefined
>(undefined);

ChatContext.displayName = 'ChatContext';

export const ChatProvider: FC<{
  params: Record<string, any>;
  sessionType?: 'text' | 'process';
  queryApi?: string;
  userInfo: UserInfoType;
  children: ReactNode;
  gptApi?: string;
}> = ({
  params,
  sessionType = 'text',
  userInfo,
  queryApi = '/CSRBroker/queryAction',
  gptApi = `${config.gptPrefix}/gpt/chat`,
  children,
}) => {
  const { request } = useContext(ConfigContext);
  const [message, updateMessage] = useState<MessageItem[]>([]);
  const [status, setStatus] = useSetState({
    loading: false,
    end: false,
  });

  /** 查询大模型答案 */
  const fetchGPT = async (data: Record<string, any>) => {
    let content = '';
    await fetchEventSource(`${config.crmPrefix}${gptApi}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        enterpriseID: userInfo?.enterpriseCode,
        businessType: 'AICC',
      }),
      async onopen() {
        setStatus({ loading: true });
      },
      openWhenHidden: true,
      onmessage(msg) {
        let reference: { title: string; src: string }[] = [];
        switch (msg.event) {
          case 'text':
            content = msg?.data;
            break;
          case 'file':
            reference = JSON.parse(msg?.data || '[]')?.map((file: any) => ({
              title: file.fileName,
              src: file.fileUrl,
            }));
            break;
          default:
            break;
        }

        updateMessage((draft) => {
          const index = draft?.findIndex(({ id }) => id === data?.queryID);
          if (index === -1) return draft;
          draft[index] = {
            ...draft[index],
            content,
            reference,
            loading: false,
          };
          return [...draft];
        });
      },
      onerror(err) {
        console.log(err, 'error');
        throw new Error('关闭连接');
      },
      onclose() {
        setStatus({ loading: false });
      },
    });
  };

  /** 清空消息 */
  const onClear = () => {
    updateMessage([]);
  };

  const formatMessage = (res: InteractionRespond) => {
    const result: MessageItem[] = [];
    const {
      singleNode,
      queryID,
      respID,
      notifyMsg,
      selectAskDataList,
      relationAskDataList,
      loop,
    } = res;

    if (notifyMsg) {
      result.push({ id: uid(), content: notifyMsg, role: 'system' });
    }
    if (!singleNode) return result;
    const { answerMsg, cmd } = singleNode;
    /** 判断通话结束 */
    if (cmd?.includes('end')) {
      setStatus({ ...status, end: true });

      result?.push(
        {
          nodeId: respID,
          id: uid(),
          content: answerMsg,
          role: 'robot',
          sessionType,
        },
        {
          id: uid(),
          content: '通话结束！',
          role: 'system',
        },
      );
    } else {
      result.push({
        content: answerMsg.replace('phrase:tts-timeleft:', ''),
        id: queryID || uid(),
        nodeId: respID,
        role: 'robot',
        showType: loop ? 'markdown' : undefined,
        loading: loop,
        sessionType,
        selectAskDataList,
        relationAskDataList,
      });
    }
    return result;
  };

  const onSend = async (data: {
    query: string;
    breakTts: '0' | '1';
    userId: string;
  }) => {
    try {
      /** 是否开始 */
      const isFirst = data?.query?.includes('first|');
      const uerMsgId = uid();
      updateMessage((draft) => {
        const item = {
          id: uerMsgId,
          content: isFirst ? '通话开始！' : data?.query,
          role: (isFirst ? 'system' : 'user') as MessageItem['role'],
        };
        return [...draft, item];
      });
      setStatus({ loading: true, end: false });
      const res = await request<InteractionRespond>(
        `${config.sdmMonkeyPrefix}${queryApi}`,
        {
          method: 'POST',
          data: {
            ...params,
            ...data,
            enterpriseID: userInfo?.enterpriseCode,
            branch: 'dev',
          },
        },
      );
      setStatus({ loading: res?.loop || false });
      if (!res) return;
      const {
        respCondID,
        matchScore,
        singleNode,
        PlayLast,
        loop,
        queryID = '',
      } = res;

      const { matchModel, matchDetail, ...matchInfo } = JSON.parse(
        res?.matchInfo || '{}',
      );

      /** 轮询答案 */
      if (loop && queryID) {
        fetchGPT({
          ...params,
          queryID,
          sessionID: data?.userId,
          query: data?.query,
          userId: data?.userId,
        });
      }

      const { regex, corpus } =
        (
          matchDetail as (Record<'type' | 'value' | 'name', string> & {
            score: number;
          })[]
        )?.reduce<Record<'corpus' | 'regex', MessageItem['regex']>>(
          (result, current) => {
            const item = {
              text: current?.value,
              title: current?.name,
              score: Math.floor((current.score || 0) * 100) / 100,
            };
            if (current.type === '正则') {
              result.regex?.push(item);
            } else {
              result.corpus?.push(item);
            }
            return result;
          },
          { regex: [], corpus: [] },
        ) || {};

      updateMessage((draft) => {
        const index = draft.findIndex(
          ({ id, role }) => id === uerMsgId && role === 'user',
        );
        if (index !== -1) {
          draft[index] = {
            ...draft[index],
            ...matchInfo,
            nodeId: respCondID,
            showMatch: !loop,
            matchScore: Math.floor((matchScore || 0) * 100) / 100,
            interrupt:
              data?.breakTts === '1'
                ? PlayLast
                  ? false
                  : singleNode?.cmd?.includes('break')
                    ? true
                    : undefined
                : undefined,
            sessionType,
            regex,
            corpus,
            matchDetail: matchModel,
          };
        }
        const result = formatMessage(res);
        return [...draft, ...result];
      });
    } catch (error) {
      console.log(error);
      setStatus({ loading: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        status,
        message,
        onClear,
        onSend,
      }}
      children={children}
    />
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext必须在ChatProvider中使用');
  }
  return context;
};
