import { PPTElementOutline } from '@/pages/MotionVideo/PPTEditor/interface';
import { useMemo } from 'react';

// 计算边框相关属性值，主要是对默认值的处理
export default (outline: PPTElementOutline | undefined) => {
  const outlineWidth = useMemo(() => outline?.width ?? 0, [outline]);
  const outlineStyle = useMemo(() => outline?.style || 'solid', [outline]);
  const outlineColor = useMemo(() => outline?.color || '#d14424', [outline]);

  const strokeDashArray = useMemo(() => {
    const size = outlineWidth;
    if (outlineStyle === 'dashed')
      return size <= 6
        ? `${size * 4.5} ${size * 2}`
        : `${size * 4} ${size * 1.5}`;
    if (outlineStyle === 'dotted')
      return size <= 6
        ? `${size * 1.8} ${size * 1.6}`
        : `${size * 1.5} ${size * 1.2}`;
    return '0 0';
  }, [outlineStyle, outlineWidth]);

  return {
    outlineWidth,
    outlineStyle,
    outlineColor,
    strokeDashArray,
  };
};
