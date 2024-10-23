import { useControllableValue } from 'ahooks';
import { InputNumber } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import React from 'react';
import styles from './index.less';

interface MarginProps {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const Margin = (props: MarginProps) => {
  const { disabled: customDisabled } = props;
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [value, onChange] = useControllableValue<string>(props);

  const values = value?.split(' ').map((val) => parseInt(val)) || [0, 0, 0, 0];

  const onValueChange = (value: number, index: number) => {
    values[index] = value;
    onChange(values.map((val) => `${val}px`).join(' '));
  };

  const baseProps = {
    min: 0,
    max: 9999,
    precision: 0,
    disabled: mergedDisabled,
  };

  return (
    <div className={styles.list}>
      <div className={styles.item}>
        <InputNumber
          {...baseProps}
          addonAfter="上方"
          value={values[0]}
          onChange={(val) => onValueChange(val || 0, 0)}
        />
      </div>
      <div className={styles.item}>
        <InputNumber
          {...baseProps}
          addonAfter="下方"
          value={values[2]}
          onChange={(val) => onValueChange(val || 0, 2)}
        />
      </div>
      <div className={styles.item}>
        <InputNumber
          {...baseProps}
          addonAfter="左侧"
          value={values[3]}
          onChange={(val) => onValueChange(val || 0, 3)}
        />
      </div>
      <div className={styles.item}>
        <InputNumber
          {...baseProps}
          addonAfter="右侧"
          value={values[1]}
          onChange={(val) => onValueChange(val || 0, 1)}
        />
      </div>
    </div>
  );
};

export default Margin;
