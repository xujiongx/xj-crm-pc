import React from 'react';
import clsx from 'clsx';
import './index.less';

interface ButtonProps {
  checked?: boolean;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'checkbox' | 'radio';
  size?: 'small' | 'normal';
  first?: boolean;
  last?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: any
}

const Button: React.FC<ButtonProps> = ({
  checked = false,
  disabled = false,
  type = 'default',
  size = 'normal',
  first = false,
  last = false,
  onClick,
  onDoubleClick = () => { },
  children,
  className,
  style
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  const buttonClass = clsx('button', className, {
    disabled,
    checked: !disabled && checked,
    default: !disabled && type === 'default',
    primary: !disabled && type === 'primary',
    checkbox: !disabled && type === 'checkbox',
    radio: !disabled && type === 'radio',
    small: size === 'small',
    first,
    last,
  });

  return (
    // 跟子组件 ActionIcon 的 button 重了
    <div style={style} className={buttonClass} onClick={() => handleClick()} onDoubleClick={() => onDoubleClick()}>
      {children}
    </div>
  );
};

export default Button;
