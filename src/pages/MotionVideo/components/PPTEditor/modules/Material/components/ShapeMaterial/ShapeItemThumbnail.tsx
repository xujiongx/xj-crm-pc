import { ShapePoolItem } from '@/pages/MotionVideo/config/shapes';
import React from 'react';
import './ShapeItemThumbnail.less';

interface ShapeItemThumbnailProps {
  shape: ShapePoolItem;
  onClick?: () => void;
  className?: string;
}

const ShapeItemThumbnail: React.FC<ShapeItemThumbnailProps> = ({
  shape,
  onClick,
  className,
}) => {
  return (
    <div className={`shape-item-thumbnail ${className}`} onClick={onClick}>
      <div className="shape-content">
        <svg overflow="visible" width="18" height="18">
          <g
            transform={`scale(${18 / shape.viewBox[0]}, ${18 / shape.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
          >
            <path
              className={`shape-path ${shape.outlined ? 'outlined' : ''}`}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="butt"
              strokeMiterlimit={8}
              fill={shape.outlined ? '#999' : 'transparent'}
              stroke={shape.outlined ? 'transparent' : '#999'}
              strokeWidth="2"
              d={shape.path}
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ShapeItemThumbnail;
