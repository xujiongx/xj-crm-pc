import { FC } from 'react';
import { Slider, InputNumber, SliderSingleProps } from 'antd';
import './index.less';

const prefix = 'aicc-speech';

const InputSlider: FC<SliderSingleProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  ...rest
}) => {
  return (
    <div className={`${prefix}-slider`}>
      <Slider
        marks={{ [min]: min, [max]: max }}
        {...rest}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
      />
      <InputNumber
        value={value}
        min={min}
        max={max}
        onChange={(num) => onChange?.(num as number)}
      />
    </div>
  );
};

export default InputSlider;
