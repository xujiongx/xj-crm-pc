import { Badge, Space, Tag } from 'antd';
import { FC, useMemo } from 'react';
import TitleDivider from '../../../TitleDivider';
import { EmotionType, PhoneConfigType, prefix } from '../../index';

interface EmotionsProps {
  options?: Array<{
    label: string;
    value:
      | 'waiter_emotion'
      | 'silence_set'
      | 'customer_emotion'
      | 'speed_detect'
      | 'qianghua'
      | 'seat_sensitive_word_detect'
      | 'customer_sensitive_word_detect';
  }>;
  data?: EmotionType;
  callCfg?: PhoneConfigType;
}

const Emotions: FC<EmotionsProps> = ({ data, callCfg, options }) => {
  const format = (key: string, text: EmotionType[keyof EmotionType]) => {
    switch (key) {
      case 'seatTalkingSpeed':
        return text ? `${text} / 字分钟` : '-';
      case 'seatForestall':
        return text === '1' ? '抢话' : '正常';
      case 'seatSensitiveNotice':
      case 'userSensitiveNotice':
        if (!Array.isArray(text) || !text?.length) return '-';
        return text?.map(({ word, count }) => (
          <Badge size="small" key={word} offset={[-10, 5]} count={count || 0}>
            <Tag>{word}</Tag>
          </Badge>
        ));
      case 'silence_set':
        return text ? `${text}s` : '正常';
      default:
        return text as string;
    }
  };

  /** 常规项检测 */
  const emotionOptions = useMemo(() => {
    if (!callCfg) return options;
    const {
      seatMoodConversion: waiter,
      customerMoodConversion: customer,
      seatTalkingSpeedConversion: speed,
      seatForestallConversion: qianghua,
      sensitiveConversion: sensitive,
      silenceConversion: silence,
    } = callCfg;
    const lists = [
      { label: '坐席情绪', value: 'seatEmotionValue', show: waiter },
      {
        label: '客户情绪',
        value: 'userEmotionValue',
        show: customer,
      },
      { label: '静音时长', value: 'silence_set', show: silence },
      {
        label: '坐席语速',
        value: 'seatTalkingSpeed',
        show: speed,
      },
      { label: '坐席抢话', value: 'seatForestall', show: qianghua },
      {
        label: '坐席敏感词',
        value: 'seatSensitiveNotice',
        show: sensitive,
      },
      {
        label: '客户敏感词',
        value: 'userSensitiveNotice',
        show: sensitive,
      },
    ];
    return lists.filter((item) => item.show);
  }, [callCfg]);

  if (!emotionOptions?.length) return null;

  return (
    <div className={`${prefix}-emotion`}>
      <TitleDivider title="常规项检测" />
      <Space wrap size={12}>
        {emotionOptions.map(({ label, value }) => (
          <div className={`${prefix}-emotion-item`} key={label}>
            <label>{`${label}：`}</label>
            <span>{format(value, data?.[value]) || '-'}</span>
          </div>
        ))}
      </Space>
    </div>
  );
};

export default Emotions;
