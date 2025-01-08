import { ConfigProvider, List, Space, Typography, notification } from 'antd';
import { orderBy } from 'lodash';
import { CSSProperties, FC, useContext, useMemo } from 'react';
import { TitleDivider } from '..';
import './index.less';

const { Link, Text } = Typography;

export interface AlarmItem {
  regularName: string;
  color: string;
  index: number;
  tip: string;
  level: number;
  levelName: string;
  messageId: number | string;
  key?: number;
  hitDetail?: Array<{
    index: number;
    text: string;
  }>;
}

interface CallAlarmProps {
  data: Array<AlarmItem>;
  onAlarmClick?: (data: AlarmItem) => void;
}

const CallAlarm: FC<CallAlarmProps> = ({ data, onAlarmClick }) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('call-alarm');
  const [api, contextHolder] = notification.useNotification();

  const showAlarm = (item: AlarmItem, index?: number) => {
    const key = `${item.messageId}-alarm`;
    api.open({
      className: `${prefixCls}-notify`,
      key,
      message: (
        <label
          className={`${prefixCls}-level`}
          style={
            {
              '--alarm-level': index,
              '--alarm-color': item.color,
            } as CSSProperties
          }
        >
          {item.levelName}
        </label>
      ),
      description: (
        <Space direction="vertical">
          <div className={`${prefixCls}-notify-item`}>
            <label>命中质检项</label>
            <span>“{item.regularName || '-'}”</span>
          </div>
          {item.hitDetail?.map(({ text }, index) => (
            <div className={`${prefixCls}-notify-item`} key={index}>
              <label>
                命中话术{item.hitDetail!.length > 1 ? index + 1 : ''}
              </label>
              <span>“{text || '-'}”</span>
            </div>
          ))}
          <div className={`${prefixCls}-notify-item`}>
            <label>提示语</label>
            <span>“{item.tip || '-'}”</span>
          </div>
        </Space>
      ),
      btn: <Link onClick={() => api.destroy(key)}>忽略</Link>,
    });
  };

  const lists = useMemo(
    () => orderBy(data, ['level', 'key'], ['desc', 'desc']),
    [data],
  );

  return (
    <div className={prefixCls}>
      {contextHolder}
      <TitleDivider title="告警信息栏" />
      <List
        bordered
        dataSource={lists}
        renderItem={(item) => (
          <List.Item
            key={item.key}
            actions={[
              <Link
                key="view"
                onClick={() => (onAlarmClick || showAlarm)?.(item, item.key)}
              >
                查看
              </Link>,
            ]}
          >
            <div
              className={`${prefixCls}-item`}
              style={{ '--alarm-color': item.color } as CSSProperties}
            >
              <label
                className={`${prefixCls}-level`}
                style={{ '--alarm-level': item.key } as CSSProperties}
              >
                {item.levelName}
              </label>
              <Text className={`${prefixCls}-text`} ellipsis>
                <strong>命中“{item.regularName}”</strong>
                {item.tip}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CallAlarm;
