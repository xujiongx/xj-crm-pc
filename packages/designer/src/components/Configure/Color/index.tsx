import { useControllableValue } from 'ahooks';
import { ColorPicker, ColorPickerProps } from 'antd';

const Color = (props: ColorPickerProps) => {
  const [value, onChange] = useControllableValue(props);

  console.log('color', value);

  return (
    <ColorPicker
      {...props}
      value={value}
      onChange={(val) => {
        onChange(val.toHexString());
      }}
    />
  );
};

export default Color;
