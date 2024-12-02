import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Popover } from 'antd';
import IconFont from '@/components/IconFont';
import './index.less';

interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps {
  value: string | number;
  options: SelectOption[];
  disabled?: boolean;
  onChange: (value: string | number) => void;
  className?: string;
  children?: React.ReactNode;
  style?: any
}

const Select: React.FC<SelectProps> = ({ value, options, disabled = false, onChange, className, children, style }) => {
  const [width, setWidth] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  const showLabel = options.find(item => item.value === value)?.label || value;

  const updateWidth = useCallback(() => {
    if (selectRef.current) {
      setWidth(selectRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateWidth);
    if (selectRef.current) {
      resizeObserver.observe(selectRef.current);
    }
    return () => {
      if (selectRef.current) {
        resizeObserver.unobserve(selectRef.current);
      }
    };
  }, [updateWidth]);

  const handleSelect = (option: SelectOption) => {
    console.log(option, 'option')
    if (!option.disabled) {
      onChange(option.value);
    }
  };

  return (
    <div className={`select-wrap ${className}`} style={style}>
      {disabled ? (
        <div className="select disabled" ref={selectRef}>
          <div className="selector">{showLabel}</div>
          <div className="icon">
            {children || <IconFont type="icon-speed" size={14} />}
          </div>
        </div>
      ) : (
        <div className="select-wrap">
          <Popover
            trigger="click"
            placement="bottom"
            overlayClassName="select-wrap-popover"
            content={
              <div className="options" style={{ width: width + 2 }}>
                {options.map((option) => (
                  <div
                    className={`tippyOption-item ${option.disabled ? 'disabled' : ''} ${option.value === value ? 'selected' : ''}`}
                    key={option.value}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            }
          >
            <div className="select" ref={selectRef}>
              <div className="selector">{showLabel}</div>
              <div className="icon">
                {children || <IconFont type="icon-speed" size={14} />}
              </div>
            </div>
          </Popover>
        </div>

      )}
    </div>
  );
};

export default Select;
