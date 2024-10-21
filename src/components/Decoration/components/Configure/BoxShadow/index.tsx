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

const ColorMap: Record<string, string> = {
  '0px 0px 6px 0px': '#f0f0f0',
  '0px 0px 10px 0px': '#e6e6e6',
  '0px 0px 16px 0px': '#d9d9d9',
};

const BoxShadow = (props: BorderProps) => {
  const { disabled: customDisabled } = props;
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  const [value, onChange] = useControllableValue<string>(props);

  const values =
    value === 'none' || !value
      ? ['none', '']
      : [
          value.substring(0, value.lastIndexOf('px') + 2),
          value.substring(value.lastIndexOf('px') + 3),
        ];

  /** 是否自定义颜色 */
  const colorCustomer = values[1]
    ? !Object.values(ColorMap).includes(values[1])
    : false;

  console.log(colorCustomer, values[1], value);

  return (
    <Space>
      <Radio.Group
        disabled={mergedDisabled}
        value={values[0]}
        onChange={(e) => {
          if (e.target.value === 'none') {
            onChange?.('none');
          } else {
            onChange?.(
              `${e.target.value} ${
                colorCustomer ? values[1] : ColorMap[e.target.value]
              }`,
            );
          }
        }}
      >
        <Radio.Button value="none">无</Radio.Button>
        <Radio.Button value="0px 0px 6px 0px">轻</Radio.Button>
        <Radio.Button value="0px 0px 10px 0px">常规</Radio.Button>
        <Radio.Button value="0px 0px 16px 0px">重</Radio.Button>
      </Radio.Group>
      {values[1] && (
        <Color
          disabled={mergedDisabled}
          value={values[1]}
          onChange={(color) => {
            onChange?.(values[0] === 'none' ? 'none' : `${values[0]} ${color}`);
          }}
        />
      )}
    </Space>
  );
};

export default BoxShadow;
