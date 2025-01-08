import React, { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import { VIEWPORT_SIZE } from '../../../../hooks/useViewportSize';
import { useMainStore, useSlidesStore } from '../../../../store';
import './index.less';

const GridLines: React.FC = () => {
  const canvasScale = useMainStore((store) => store.canvasScale);
  const gridLineSize = useMainStore((store) => store.gridLineSize);
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );
  const viewportSize = VIEWPORT_SIZE;

  const background = useMemo(() => currentSlide?.background, [currentSlide]);

  // 计算网格线的颜色，避免与背景的颜色太接近
  const gridColor = useMemo(() => {
    const bgColor = background?.color || '#fff';
    const colorList = ['#000', '#fff'];
    return tinycolor
      .mostReadable(bgColor, colorList, { includeFallbackColors: true })
      .setAlpha(0.5)
      .toRgbString();
  }, [background]);

  // 网格路径
  const path = useMemo(() => {
    const maxX = viewportSize;
    const maxY = viewportSize * viewportRatio;

    let p = '';
    for (let i = 0; i <= Math.floor(maxY / gridLineSize); i++) {
      p += `M0 ${i * gridLineSize} L${maxX} ${i * gridLineSize} `;
    }
    for (let i = 0; i <= Math.floor(maxX / gridLineSize); i++) {
      p += `M${i * gridLineSize} 0 L${i * gridLineSize} ${maxY} `;
    }
    return p;
  }, [viewportSize, viewportRatio, gridLineSize]);

  return (
    <svg className="grid-lines">
      <path
        style={{ transform: `scale(${canvasScale})` }}
        d={path}
        fill="none"
        stroke={gridColor}
        strokeWidth="0.3"
        strokeDasharray="5"
      />
    </svg>
  );
};

export default GridLines;
