import { useControllableValue } from 'ahooks';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import clsx from 'clsx';
import React from 'react';
import styles from './index.less';

interface ImageRadioProps {
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  options: Array<{
    image: string;
    activeImage: string;
    label: string;
    value: string | number;
  }>;
}

const ImageRadio = ({
  options = [],
  disabled: customDisabled,
  ...rest
}: ImageRadioProps) => {
  const [value, onChange] = useControllableValue(rest);
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  return (
    <div className={styles.list}>
      {options.map((item, index) => (
        <div
          key={index}
          onClick={() => !mergedDisabled && onChange(item.value)}
          className={clsx(styles.item, {
            [styles['item-active']]: value === item.value,
            [styles['item-disabled']]: mergedDisabled,
          })}
        >
          <div className={styles['item-cover']}>
            <img src={value === item.value ? item.activeImage : item.image} />
          </div>
          <span className={styles['item-label']}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ImageRadio;
