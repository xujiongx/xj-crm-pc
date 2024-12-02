import React from 'react';
import Button from '../Button/index';
import './index.less'

type Props = {
  color?: string
  children?: React.ReactNode
  style?: any
}

const TextColorButton: React.FC<Props> = ({ color, children, style }) => {
  return (
    <Button style={style} className="text-color-btn">
      {children}
      <div className="text-color-block">
        <div className="text-color-block-content" style={{ backgroundColor: color }}></div>
      </div>
    </Button>
  );
};

export default TextColorButton;
