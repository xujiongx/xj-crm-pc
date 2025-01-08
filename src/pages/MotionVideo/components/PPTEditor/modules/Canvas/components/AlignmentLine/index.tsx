import { AlignmentLineAxis } from '@/pages/MotionVideo/interface';
import React from 'react';
import './index.less';

interface AlignmentLineProps {
  type: 'vertical' | 'horizontal';
  axis: AlignmentLineAxis;
  length: number;
  canvasScale: number;
}

const AlignmentLine: React.FC<AlignmentLineProps> = ({
  type,
  axis,
  length,
  canvasScale,
}) => {
  // 吸附对齐线的位置
  const left = `${axis.x * canvasScale}px`;
  const top = `${axis.y * canvasScale}px`;

  // 吸附对齐线的长度
  const sizeStyle = {
    width: type === 'vertical' ? '0' : `${length * canvasScale}px`,
    height: type === 'vertical' ? `${length * canvasScale}px` : '0',
    border: '0 dashed @themeColor',
  };

  return (
    <div className="alignment-line" style={{ left, top }}>
      <div className={`line ${type}`} style={sizeStyle}>
        {type === 'vertical' && (
          <div
            style={{ transform: 'translateY(-0.5px)', borderLeftWidth: '1px' }}
          />
        )}
        {type === 'horizontal' && (
          <div
            style={{ transform: 'translateX(-0.5px)', borderTopWidth: '1px' }}
          />
        )}
      </div>
    </div>
  );
};

export default AlignmentLine;
