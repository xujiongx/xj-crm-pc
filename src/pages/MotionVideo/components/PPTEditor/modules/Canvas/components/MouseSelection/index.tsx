import React from 'react';
import './index.less';

interface MouseSelectionProps {
  top: number;
  left: number;
  width: number;
  height: number;
  quadrant: number;
}

const MouseSelection: React.FC<MouseSelectionProps> = ({
  top,
  left,
  width,
  height,
  quadrant,
}) => {
  const className = `mouse-selection quadrant-${quadrant}`;

  const style = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return <div className={className} style={style}></div>;
};

export default MouseSelection;
