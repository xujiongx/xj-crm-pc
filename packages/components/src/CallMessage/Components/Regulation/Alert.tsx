import { CSSProperties, FC, useState } from 'react';
import { Alert } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useCountdown } from '@aicc/hooks';
import { CallMessageType } from '@/CallMessage/index';

interface RegularAlertProps {
  index: number;
  item: NonNullable<CallMessageType['regular']>[0];
  duration?: number;
  color?: string;
  showIndex?: boolean;
}

const RegularAlert: FC<RegularAlertProps> = ({
  index,
  duration,
  item,
  color,
  showIndex,
}) => {
  const [visible, setVisible] = useState(true);

  useCountdown({
    value: duration || item.duration,
    onEnd: () => setVisible(false),
  });

  return visible ? (
    <Alert
      type="warning"
      key={index}
      icon={showIndex ? index : <ExclamationCircleFilled />}
      showIcon
      message={item.tooltip}
      data-icon={showIndex ? 'index' : 'icon'}
      style={{ '--alarm-color': color } as CSSProperties}
    />
  ) : null;
};

export default RegularAlert;
