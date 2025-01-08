import { FC, useMemo } from 'react';
import { Tag, Space, Divider } from 'antd';
import { LimitText } from 'qnzs-ui';
import { CallMessageType } from '@/CallMessage/index';
import { prefix } from '../../index';
import RegularAlert from './Alert';
import '../../index.less';

interface RegulationProps {
  duration?: number;
  showIndex?: boolean;
  regular: CallMessageType['regular'];
  flow: CallMessageType['flow'];
}

const Regulation: FC<RegulationProps> = ({
  duration = 5000,
  showIndex,
  regular,
  flow,
}) => {
  const renderRules = (
    rules?: Record<'alarm' | 'point', CallMessageType['regular']>,
  ) => {
    if (!rules) return null;
    return (
      <div className={`${prefix}-regular-rules`}>
        <label>命中质检项</label>
        <div className={`${prefix}-regular-rules-point`}>
          {rules?.alarm?.length ? (
            <div className={`${prefix}-regular-rules-warn`}>
              <Space size={0} wrap={true} split={<Divider type="vertical" />}>
                {rules?.alarm?.map((item, index) => (
                  <span key={index}>{item.name}</span>
                ))}
              </Space>
              <i
                className={`${prefix}-regular-rules-angry`}
                style={{
                  backgroundImage: `url(${require('@aicc/assets/es/svg/anger.svg')})`,
                }}
              />
            </div>
          ) : null}
          {rules?.point?.length ? (
            <div style={{ textAlign: 'left' }}>
              <Space size={0} wrap={true} split={<Divider type="vertical" />}>
                {rules?.point?.map((item, index) => (
                  <span key={index}>{item.name}</span>
                ))}
              </Space>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderFlow = () => {
    if (!flow?.length) return null;
    return (
      <div className={`${prefix}-regular-flow`}>
        <label>命中流程：</label>
        <Space
          wrap={true}
          style={{ maxWidth: 'calc(100% - 70px)', textAlign: 'left' }}
        >
          {flow?.map((item) => (
            <Tag key={item.processName} color="processing">
              <Space size={0} direction="vertical">
                <span>流程名称：{item.processName}</span>
                <span>
                  流程话术：
                  <LimitText text={item.text || '-'} maxLength={10} />
                </span>
                <span>匹配度：{item.score}</span>
              </Space>
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  const data = useMemo(() => {
    if (!regular) return;
    const alarm: typeof regular = [];
    const point: typeof regular = [];
    for (const item of regular) {
      if (item.warn) {
        alarm.push(item);
      } else {
        point.push(item);
      }
    }
    return {
      alarm,
      point,
      tooltips: regular?.filter(({ tooltip }) => tooltip),
    };
  }, [regular]);

  return (
    <div className={`${prefix}-regular`}>
      {renderRules(data)}
      {renderFlow()}
      {data?.tooltips?.length ? (
        <Space direction="vertical">
          {data?.tooltips?.map((item, index) => (
            <RegularAlert
              key={index}
              item={item}
              index={item.index!}
              showIndex={showIndex}
              duration={duration}
              color={item.color}
            />
          ))}
        </Space>
      ) : null}
    </div>
  );
};

export default Regulation;
