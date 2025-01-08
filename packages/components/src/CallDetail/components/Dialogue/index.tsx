import { Avatar, Space, Tag } from 'antd';
import { FC, Fragment } from 'react';
import MatchDetail from '../../../Interaction/components/Match';
import { prefix as cssPrefix } from '../../index';
import type { MessageItem } from '../../interface';
import PlayIcon from '../PlayIcon';
import Tags from '../Tags';
import './index.less';

interface DialogType {
  data: MessageItem;
  playing?: boolean;
  readonly?: boolean;
  onPlay?: (start?: number, end?: number) => void;
}

const Dialog: FC<DialogType> = ({ playing, readonly, data, onPlay }) => {
  const prefix = `${cssPrefix}-dialog`;

  const {
    role,
    noMatch,
    content,
    matchDetail,
    interrupt,
    score,
    corpus,
    regex,
    nodeTitle,
  } = data;

  const renderMatch = () => {
    if (role !== 'user' || content === '_end_') return null;
    const fields = [
      {
        label: '置信度',
        value: score ? Math.floor(score * 100) / 100 : score,
      },
      { label: '命中结果', value: matchDetail?.matchModel },
      { label: '机器人回复', value: matchDetail?.answerType },
      { label: '命中内容', value: matchDetail?.matchContent },
    ];
    if (interrupt !== undefined)
      fields.push({ label: '打断', value: interrupt ? '成功' : '失败' });

    const isExist = fields?.find(({ value }) => value !== undefined);

    return isExist || (regex || corpus || [])?.length ? (
      <MatchDetail fields={fields} regex={regex || []} corpus={corpus || []} />
    ) : null;
  };

  const renderAvatar = () => {
    const key = {
      user: 'student.png',
      robot: 'customer.svg',
      agent: 'agent.svg',
    };
    if (!key[role]) return null;

    return (
      <Avatar size={32} src={require(`@aicc/assets/es/avatar/${key[role]}`)} />
    );
  };

  const renderMessage = () => {
    const message = nodeTitle ? `${nodeTitle}: ${content}` : content;
    if (['robot', 'system'].includes(role)) return message;
    return (
      <Fragment>
        {data?.slots && onplay ? (
          <PlayIcon playing={playing} className={`${prefix}-playing`} />
        ) : null}
        <span>{message}</span>
      </Fragment>
    );
  };

  return (
    <div className={prefix} data-role={role}>
      {renderAvatar()}
      <div className={`${prefix}-pannel`}>
        <div className={`${prefix}-content`}>
          <div
            className={`${prefix}-text`}
            style={{ cursor: onPlay ? 'pointer' : undefined }}
            onClick={() => {
              if (!data?.slots) return;
              onPlay?.(data?.slots?.[0]);
            }}
          >
            {renderMessage()}
          </div>
          {role === 'user' ? (
            <Space style={{ maxWidth: 200, minWidth: 42 }} wrap>
              {interrupt !== undefined ? (
                <Tag style={{ whiteSpace: 'nowrap' }}>
                  {`打断${interrupt ? '失败' : '成功'}`}
                </Tag>
              ) : null}
              {noMatch ? (
                <Tag style={{ whiteSpace: 'nowrap' }}>未识别</Tag>
              ) : null}
            </Space>
          ) : null}
        </div>
        {role === 'user' ? (
          <div className={`${prefix}-extra`}>
            <Tags disabled={readonly} value={data?.tags} />
            {renderMatch()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dialog;
