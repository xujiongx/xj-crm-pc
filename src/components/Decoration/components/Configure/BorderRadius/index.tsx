import { useControllableValue } from 'ahooks';
import { Slider } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import React from 'react';

interface BorderRadiusProps {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const BorderRadius = (props: BorderRadiusProps) => {
  const { disabled: customDisabled } = props;
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [value, onChange] = useControllableValue(props);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Slider
        autoFocus={false}
        style={{ flex: 'auto' }}
        tooltip={{
          formatter: (val) => `${val || 0}px`,
        }}
        min={0}
        max={50}
        disabled={mergedDisabled}
        value={parseInt(value)}
        onChange={(val) => onChange(`${val}px`)}
      />
      <span>{value || '0px'}</span>
    </div>
  );
};

export default BorderRadius;
