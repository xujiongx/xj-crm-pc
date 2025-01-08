import { Button, Checkbox, FormInstance, Space } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import Conditions from './components/Conditions';
import Message from './components/Message';
import TextArea, { TextAreaRef } from './components/TextArea';
import { useChatContext } from './context';
import { InteractionProps } from './index';
import './index.less';

export const prefix = 'aicc-interaction';

interface Props
  extends Omit<InteractionProps, 'userInfo' | 'processInfo' | 'params'> {
  query: string[];
  form: FormInstance;
}

const Main: FC<Props> = ({
  form,
  conditions,
  query,
  startNodeId,
  avatar,
  onSupportBreak,
  unRenderConditions,
  conditionExtra,
  handleItemClick,
}) => {
  const { message, status, onSend, onClear } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextAreaRef>(null);
  const [state, setState] = useState({
    breakTts: false,
    userId: '',
  });

  const lastMessage = message?.[message?.length - 1];

  const init = async () => {
    const values = await form.validateFields();

    const temp = [...query];
    for (const [key, value] of Object.entries<string>(values)) {
      if (!value) continue;
      temp.push(key, value);
    }
    const userId = `qnzs${new Date().getTime()}`;
    setState({ ...state, userId: userId });
    onSend({
      ...state,
      breakTts: state?.breakTts ? '1' : '0',
      query: temp.join('|'),
      userId,
      startRobotNodeID: startNodeId,
    });
  };

  const onSendMessage = (value: string, params?: Record<string, string>) => {
    onSend({
      ...state,
      query: value?.trim(),
      breakTts: state?.breakTts ? '1' : '0',
      ...(params || {}),
    });
  };

  const onPressEnter = (value?: string) => {
    const text = value || inputRef.current?.text;

    if (status?.end || status?.loading || !text?.trim() || !state?.userId)
      return;
    onSendMessage(text);
    inputRef.current?.onClear();
  };

  const scrollToEnd = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current?.scrollHeight,
    });
  };

  useEffect(() => {
    scrollToEnd();
  }, [message?.length, lastMessage]);

  return (
    <div className={prefix}>
      {!unRenderConditions && (
        <Conditions
          form={form}
          conditions={conditions}
          extra={conditionExtra}
        />
      )}
      <div className={`${prefix}-panel`}>
        <div ref={containerRef} className={`${prefix}-messages`}>
          <div className={`${prefix}-messages-container`}>
            {message?.map((item) => (
              <Message
                key={item.id}
                data={item}
                avatar={avatar!}
                onClick={handleItemClick}
                onSend={onSendMessage}
              />
            ))}
          </div>
        </div>
        <TextArea ref={inputRef} onPressEnter={(text) => onPressEnter(text)} />
        <div className={`${prefix}-footer`}>
          {!onSupportBreak ? (
            <Checkbox
              checked={state?.breakTts}
              onChange={(event) =>
                setState({ ...state, breakTts: event?.target.checked })
              }
            >
              支持打断
            </Checkbox>
          ) : (
            <div />
          )}
          <Space>
            <Button onClick={onClear}>清空对话</Button>
            <Button onClick={init} loading={status?.loading}>
              {status?.end || message?.length ? '重新开始' : '开始'}
            </Button>
            <Button
              type="primary"
              loading={status?.loading}
              disabled={status?.end || !state?.userId}
              onClick={() => onPressEnter()}
            >
              发送
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Main;
