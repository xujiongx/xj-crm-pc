import React from 'react';
import { RadioGroupProvider } from './context';
import ButtonGroup from '../ButtonGroup/index';

interface RadioGroupProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string
  style?: any
}

const RadioGroup: React.FC<RadioGroupProps> = ({ value, disabled = false, onChange, children, className, style }) => {
  return (
    <RadioGroupProvider value={value} disabled={disabled} onChange={onChange}>
      <ButtonGroup className={`radio-group ${className}`} style={style}>
        {children}
      </ButtonGroup>
    </RadioGroupProvider>
  );
};

export default RadioGroup;
