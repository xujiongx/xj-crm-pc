import React, { forwardRef, ReactNode } from 'react';
import './index.less';

interface ButtonGroupProps {
  passive?: boolean;
  children: ReactNode;
  className?: string
  style?: any
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(({ passive = false, children, className, style}, ref) => {
  return (
    <div style={style} className={`button-group ${passive ? 'passive' : ''} ${className}`} ref={ref}>
      {children}
    </div>
  );
});

export default ButtonGroup;
