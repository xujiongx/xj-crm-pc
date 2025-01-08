import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Typography } from 'antd';
import { FC } from 'react';
import IconFont from '../../../IconFont';
import MessageContent from '../../../Message';
import { InteractionProps } from '../../index';
import { MessageItem } from '../../interface';
import MatchDetail from '../Match';
import './index.less';

const { Link } = Typography;

const prefix = 'aicc-interaction-message';

interface MessageProps {
  data: MessageItem;
  avatar: { user: any; robot: any };
  onClick?: InteractionProps['handleItemClick'];
  onSend?: (value: string, params: { processId?: string }) => void;
}

const Message: FC<MessageProps> = ({ data, avatar, onClick, onSend }) => {
  const { corpus, regex, reference } = data;

  const renderIcon = () => {
    if (data?.role === 'system') {
      return <InfoCircleOutlined style={{ marginLeft: 5 }} />;
    }
    if (data?.sessionType === 'process' && data?.nodeId) {
      return (
        <span className={`${prefix}-affix`}>
          <IconFont type="icon-affix" />
        </span>
      );
    }
    return null;
  };

  const renderMessage = () => {
    switch (data?.role) {
      case 'robot':
        return !data?.loading ? (
          <MessageContent
            content={data?.content}
            showType={data?.showType}
            selectAskDataList={data?.selectAskDataList}
            relationAskDataList={data?.relationAskDataList}
            onSelect={(value, event, data) => {
              event?.stopPropagation();
              onSend?.(value, { processId: data?.ProcessId });
            }}
          />
        ) : (
          <LoadingOutlined />
        );
      default:
        return data?.content;
    }
  };

  const renderMatch = () => {
    if (!data) return;
    const {
      role,
      content,
      matchScore,
      matchDetail,
      answerType,
      matchContent,
      interrupt,
      showMatch,
    } = data;
    if (role !== 'user' || content === '_end_' || !showMatch) return null;
    const fields = [
      {
        label: '置信度',
        value: matchScore ? Math.floor(matchScore * 100) / 100 : matchScore,
      },
      { label: '命中结果', value: matchDetail },
      { label: '机器人回复', value: answerType },
      { label: '命中内容', value: matchContent },
    ];
    if (interrupt !== undefined)
      fields.push({ label: '打断', value: interrupt ? '成功' : '失败' });
    return (
      <MatchDetail fields={fields} corpus={corpus || []} regex={regex || []} />
    );
  };

  const renderReference = () => {
    if (!reference?.length) return;
    return (
      <div className={`${prefix}-reference`}>
        <span className={`${prefix}-reference-tip`}>参考来源：</span>
        <div className={`${prefix}-reference-list`}>
          {reference?.map(({ title, src }) => {
            const ellipsis = title?.length > 15;
            const children = (
              <Link href={src} key={src} target="_blank">
                {ellipsis ? `${title?.slice(0, 14)}...` : title}
              </Link>
            );
            if (!ellipsis) return children;
            return (
              <Tooltip key={src} title={title}>
                {children}
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={prefix} data-role={data.role}>
      {data?.role !== 'system' ? (
        <Avatar
          className={`${prefix}-avatar`}
          size={32}
          src={avatar?.[data?.role]}
        />
      ) : null}
      <div className={`${prefix}-panel`}>
        <div className={`${prefix}-content`} onClick={() => onClick?.(data)}>
          <span
            className={`${prefix}-text`}
            style={{ cursor: onClick ? 'pointer' : 'unset' }}
          >
            {renderMessage()}
            {renderIcon()}
            {renderReference()}
          </span>
        </div>
        {renderMatch()}
      </div>
    </div>
  );
};

export default Message;
