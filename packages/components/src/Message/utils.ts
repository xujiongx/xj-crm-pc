import { transferMessage } from '@aicc/shared';
import { pick } from 'lodash';
import type { HistorSessionItem, MessageItem } from './types';

export function formatterRobotData(item: any, isCurrent: boolean) {
  const { robotResp, kbID } = item;
  const messages: MessageItem[] = [];
  if (!robotResp) return messages;
  const { ansDetail, robotMsgID: msgID } = robotResp;
  ansDetail?.forEach((item, index) => {
    const { fileInfo, content, askPre } = item;
    const basic = {
      userID: kbID!,
      history: isCurrent,
      role: 'bot' as const,
      showType: item.extraAns?.isChatGptAnswer ? 'markdown' : undefined,
      ...pick(robotResp, ['ts', 'sn', 'msgID']),
      ...pick(item.extraAns, [
        'relationAskDataList',
        'similarAskLabelDataList',
        'selectAskDataList',
        'processAskDataList',
      ]),
      reference: item?.kimiFile
        ? JSON.parse(item.kimiFile || '[]')?.map((file: any) => ({
            title: file.fileName,
            src: file.fileUrl,
          }))
        : undefined,
    };
    messages.push({
      ...basic,
      askPre,
      content,
      key: ansDetail?.length > 1 ? `${msgID}-${index}` : msgID,
    });
    if (fileInfo) {
      const files = JSON.parse(fileInfo);
      for (const file of files) {
        messages.push({
          ...basic,
          content: transferMessage(file),
          key: `${msgID}-${file.uid}`,
        });
      }
    }
  });
  return messages;
}

function formatMatch(data?: string) {
  if (!data) return undefined;
  const matchInfo = JSON.parse(data);
  const { regex, corpus } =
    matchInfo?.matchDetail?.reduce(
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

  return {
    matchScore: matchInfo?.score || 0,
    matchContent: matchInfo?.matchContent,
    matchDetail: matchInfo?.matchModel,
    answerType: matchInfo?.answerType,
    regex,
    corpus,
  };
}

export function formatMessage(data: {
  messages: HistorSessionItem[];
  isCurrent?: boolean;
}) {
  const { messages, isCurrent } = data;
  const texts: MessageItem[] = [];
  const matchKeys: Record<string, any> = {};
  const len = messages?.length || 0;
  for (let i = len - 1; i >= 0; i--) {
    const item = messages[i];
    /** 历史会话不显示 */
    if (['[partExit]'].includes(item.content) || item.isWithdraw) continue;
    if (item.role === 'bot') {
      const { cusMsgID, matchInfo } = item.robotResp || {};
      matchKeys[cusMsgID!] = formatMatch(matchInfo);
      const result = formatterRobotData(item, !isCurrent);
      texts.push(...result);
    } else {
      texts.push({
        ...pick(item, [
          'content',
          'msgID',
          'source',
          'role',
          'leaveMsgResps',
          'ts',
        ]),
        key: item.msgID,
        actionType: item.ActionType,
        userID: item.role === 'user' ? item.cusID : item.seatID,
        history: isCurrent,
      });
    }
  }

  return texts
    ?.map((item) => {
      if (item.role === 'user') {
        return {
          ...item,
          matchInfo: matchKeys[item.msgID] || undefined,
        };
      }
      return item;
    })
    ?.sort((a, b) => a.ts - b.ts);
}
