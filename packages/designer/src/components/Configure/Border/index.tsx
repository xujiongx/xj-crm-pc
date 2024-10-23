import { useControllableValue } from 'ahooks';
import { Radio, Space } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import React from 'react';
import Color from '../Color';

interface BorderProps {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const Border = (props: BorderProps) => {
  const { disabled: customDisabled } = props;
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [value, onChange] = useControllableValue<string>(props);

  const values = value?.split(' ') || ['0px', 'solid', '#ebebeb'];

  return (
    <Space>
      <Radio.Group
        disabled={mergedDisabled}
        value={values[0]}
        onChange={(e) => {
          onChange?.(`${e.target.value} ${values[1]} ${values[2]}`);
        }}
      >
        <Radio.Button value="0px">无</Radio.Button>
        <Radio.Button value="1px">细</Radio.Button>
        <Radio.Button value="2px">粗</Radio.Button>
      </Radio.Group>
      {values[0] !== '0px' && (
        <Color
          disabled={mergedDisabled}
          value={values[2]}
          onChange={(color) => {
            onChange?.(`${values[0]} ${values[1]} ${color}`);
          }}
        />
      )}
    </Space>
  );
};

export default Border;
