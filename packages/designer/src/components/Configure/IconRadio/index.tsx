import { useControllableValue } from 'ahooks';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import clsx from 'clsx';
import React from 'react';
import DIcon from '../../Element/DIcon';
import styles from './index.less';

interface IconRadioProps {
  icons: Array<string>;
  disabled?: boolean;
}

const IconRadio = ({
  icons,
  disabled: customDisabled,
  ...rest
}: IconRadioProps) => {
  const [value, onChange] = useControllableValue(rest);
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  return (
    <div
      className={clsx(styles.list, {
        [styles['list-disabled']]: mergedDisabled,
      })}
    >
      <div
        onClick={() => !mergedDisabled && onChange('')}
        className={clsx(styles.item, {
          [styles['item-active']]: !value,
        })}
      >
        <DIcon type="icon-none" />
      </div>
      {icons.map((item) => (
        <div
          key={item}
          onClick={() => !mergedDisabled && onChange(item)}
          className={clsx(styles.item, {
            [styles['item-active']]: value === item,
          })}
        >
          <DIcon type={`icon-${item}`} />
        </div>
      ))}
    </div>
  );
};

export default IconRadio;
