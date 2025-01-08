import React, { useState, useRef, ChangeEvent, FocusEvent, KeyboardEvent, useImperativeHandle, ReactNode, HTMLAttributes, forwardRef, FC } from 'react';
import './index.less';

interface InputProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onEnter?: (event: KeyboardEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

interface InputHandle {
  focus: () => void;
}

const Input: FC<InputProps & HTMLAttributes<HTMLInputElement>> = forwardRef<InputHandle, InputProps & HTMLAttributes<HTMLInputElement>>(({
  value,
  disabled = false,
  placeholder = '',
  onChange,
  onInput,
  onBlur,
  onFocus,
  onEnter,
  children,
  ...rest
}, ref) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) inputRef.current.focus();
    }
  }));

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value);
    if (onInput) onInput(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter(e);
    }
  };

  return (
    <div className={`input ${disabled ? 'disabled' : ''} ${focused ? 'focused' : ''}`}>
      <span className="prefix">
        {children && React.Children.map(children, (child: any) => child.props.slot === 'prefix' ? child : null)}
      </span>
      <input
        type="text"
        ref={inputRef}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...rest}
      />
      <span className="suffix">
        {children && React.Children.map(children, (child: any) => child.props.slot === 'suffix' ? child : null)}
      </span>
    </div>
  );
});

export default Input;
