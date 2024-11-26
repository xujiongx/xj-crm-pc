import React from 'react';
import Button from '../Button/index';

interface CheckboxButtonProps {
  checked?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: any
  onClick?: () => void
  onDoubleClick?: () => void
}

const CheckboxButton: React.FC<CheckboxButtonProps> = ({ checked = false, disabled = false, children, style, onClick = () => { }, onDoubleClick = () => { } }) => {
  return (
    <Button onClick={() => onClick()} onDoubleClick={() => onDoubleClick} checked={checked} disabled={disabled} style={style} type="checkbox">
      {children}
    </Button>
  );
};

export default CheckboxButton;
