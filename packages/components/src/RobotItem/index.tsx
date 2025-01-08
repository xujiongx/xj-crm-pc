import { LoadingOutlined, MoreOutlined } from '@ant-design/icons';
import { Card, Modal, Popconfirm, Popover, Space, Switch } from 'antd';
import { Access, ActionGroup, LimitText } from 'qnzs-ui';
import { FC, Fragment, useState } from 'react';
import './index.less';
import type { RobotItemType } from './interface';
import { ROBOT_TYPE_STATUS } from './status';

interface CardItemProps {
  data: RobotItemType;
  onEdit?: (data: RobotItemType) => void;
  refresh?: () => void;
  onRemove?: (id: string) => void;
  onSwitchChange?: (val: boolean, item: RobotItemType) => void;
  onView?: (
    id?: string,
    robotName?: string,
    onlineStatus?: number,
    robotType?: number,
    modelId?: string,
  ) => void;
  isCallout?: boolean;
  onPublishVi?: (id?: string) => void;
  onConfig?: (
    id?: string,
    robotName?: string,
    onlineStatus?: number,
    robotType?: number,
    modelId?: string,
  ) => void;
  onPublish?: (id: string) => void;
  onSynchronization?: (robotId: string) => void;
}

const RobotItem: FC<CardItemProps> = ({
  data,
  onEdit,
  onRemove,
  onSwitchChange,
  onView,
  isCallout,
  onPublishVi,
  onConfig,
  onPublish,
  onSynchronization,
}) => {
  const [popover, setPopover] = useState(false);
  const statusItem = ROBOT_TYPE_STATUS?.find(
    ({ value }) => value === data?.robotType,
  );

  /** 训练状态 null：未训练，展示文案：不需要展示文案   -1 排队中 0 训练中 1训练完成，可发布 2训练失败 */
  const onlineStatusFormat = (value?: string) => {
    if (!value) return;

    if (['-1', '0']?.includes(value))
      return (
        <span>
          训练中
          <LoadingOutlined />
        </span>
      );
    const status: Record<string, string> = {
      1: '训练完成',
      2: '训练失败',
    };
    return status[value] || null;
  };

  /** 知识状态 1 有更新 0 无更新*/
  const onlineUpdateStatus = (value?: string) => {
    if (!value) return;
    const status: Record<string, string> = {
      1: '有更新',
      0: '无更新',
    };
    return status[value] || null;
  };

  const renderDescription = () => {
    const {
      proTime,
      proBy,
      updateBy,
      robotName,
      id,
      trainStatus,
      modelId,
      onlineStatus,
      createTime,
      updateTime,
      createBy,
      robotType,
      pushFlag,
      knowledgeSynStatus,
    } = data;
    return (
      <Space size={16} style={{ width: '100%' }} direction="vertical">
        <div className={'card-info-item'}>
          <Space align="center">
            <span className={'devTitle'}>测试环境</span>
            <span
              style={{
                color: '#FF8C30',
                fontSize: 12,
                lineHeight: '22px',
                display: 'inline-block',
              }}
            >
              {onlineStatusFormat(trainStatus)}
            </span>
          </Space>
          <ActionGroup
            split={null}
            size={8}
            actions={[
              {
                title: '配置',
                key: 'config',
                onClick: () =>
                  onConfig?.(id, robotName, onlineStatus, robotType, modelId),
              },

              {
                title: '发布机器人',
                key: 'publish',
                onClick: () =>
                  Modal.confirm({
                    title: '是否确认发布机器人？',
                    onOk: () => onPublish?.(id!),
                  }),
              },
              {
                title: '发布记录',
                key: 'record',
                onClick: () => onPublishVi?.(id),
              },
            ]}
          />
        </div>
        {/* 是否有知识同步 */}
        {knowledgeSynStatus ? (
          <div className={'card-info-item'}>
            <Space align="center">
              <span className={'creaTimeText'}>知识状态:</span>
              <span
                style={{
                  color: '#FF8C30',
                  fontSize: 12,
                  lineHeight: '22px',
                  display: 'inline-block',
                }}
              >
                {onlineUpdateStatus(knowledgeSynStatus) || '无更新'}
              </span>
            </Space>
            <ActionGroup
              split={null}
              size={8}
              actions={[
                {
                  title: '知识同步',
                  key: 'synchronization',
                  onClick: () => onSynchronization?.(id!),
                },
              ]}
            />
          </div>
        ) : null}
        <div className={'card-info-item'}>
          <span className={'creaTimeText'}>最后修改人/时间</span>
          <span className={'creaTimeText'}>
            <LimitText maxLength={10} text={updateBy || createBy} />/
            {updateTime || createTime}
          </span>
        </div>
        <div className={'card-info-item'}>
          <Space align="center">
            <span className={'devTitle'} style={{ marginTop: 10 }}>
              正式环境
            </span>
            {/* {ROBOT_VOICE_STATUS[pushFlag!] ? (
              <span className={'voiceStatus'} data-status={pushFlag}>
                {`录音状态：${ROBOT_VOICE_STATUS[pushFlag!]}`}
                {pushFlag === 1 ? <LoadingOutlined /> : null}
              </span>
            ) : null} */}
          </Space>
          <a
            className={'actionBtn'}
            onClick={() =>
              onView?.(id, robotName, onlineStatus, robotType, modelId)
            }
          >
            查看
          </a>
        </div>
        <div className={'card-info-item'}>
          <span className={'creaTimeText'}>最后发布人/时间</span>
          <span className={'creaTimeText'}>
            <LimitText maxLength={10} text={proBy || '-'} />/{proTime || '-'}
          </span>
        </div>
      </Space>
    );
  };

  return (
    <Fragment>
      <Card
        key={data.id}
        hoverable
        title={
          <div>
            {isCallout ? (
              <div className={`status status-${statusItem?.status}`}>
                {statusItem?.label || '-'}
              </div>
            ) : null}
            <p
              className={'cardTitle'}
              style={{ marginLeft: isCallout ? 40 : 0 }}
            >
              {data.robotName}
            </p>
            <p className={'robotId'}>机器人ID：{data.id}</p>
          </div>
        }
        extra={
          <div style={{ position: 'absolute', top: 12, right: 16 }}>
            <Switch
              onChange={(e) => onSwitchChange?.(e, data)}
              checked={data.isOpen === 1}
            />
            <Popover
              open={popover}
              content={
                <Space direction={'vertical'}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setPopover(false);
                      onEdit?.(data);
                    }}
                  >
                    编辑
                  </span>
                  <Access accessible={!!onRemove}>
                    <Popconfirm
                      placement="topRight"
                      title="你确定要移除该机器人吗"
                      onConfirm={() => {
                        setPopover(false);
                        onRemove?.(data.id!!);
                      }}
                    >
                      <span style={{ cursor: 'pointer' }}>删除</span>
                    </Popconfirm>
                  </Access>
                </Space>
              }
              trigger="click"
              placement="right"
              onOpenChange={(open) => setPopover(open)}
            >
              <MoreOutlined
                key={data.id}
                style={{
                  fontSize: 16,
                  color: '#000',
                  marginLeft: 10,
                }}
              />
            </Popover>
          </div>
        }
        className={'card'}
      >
        {renderDescription()}
      </Card>
    </Fragment>
  );
};

export default RobotItem;
