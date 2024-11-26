import React from 'react';
import './index.less';

interface PopoverMenuItemProps {
  center?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const PopoverMenuItem: React.FC<PopoverMenuItemProps> = ({ center = false, onClick, children }) => {
  return (
    <div className={`popover-menu-item ${center ? 'center' : ''}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default PopoverMenuItem;
