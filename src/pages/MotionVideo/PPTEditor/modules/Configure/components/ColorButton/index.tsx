import React from 'react';
import Button from '../Button';
// import { PaletteOutlined } from '@ant-design/icons';
import './index.less';

interface ColorButtonProps {
  color: string;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color }) => {
  return (
    <div className="color-btn">
      <div className="color-block">
        <div className="content" style={{ backgroundColor: color }}></div>
      </div>
      {/* <PaletteOutlined className="color-btn-icon" /> */}
    </div>
  );
};

export default ColorButton;
