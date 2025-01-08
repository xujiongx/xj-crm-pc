import { PPTElement } from '@/pages/MotionVideo/interface';
import { getElementListRange } from '@/pages/MotionVideo/utils/element';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { VIEWPORT_SIZE } from '../../../../hooks/useViewportSize';
import { useMainStore } from '../../../../store';
import './index.less';

interface ViewportStyles {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Props {
  viewportStyles: ViewportStyles;
  elementList: PPTElement[];
}

const Ruler: React.FC<Props> = ({ viewportStyles, elementList }) => {
  const canvasScale = useMainStore((store) => store.canvasScale);
  const activeElementIdList = useMainStore((store) => store.activeElementIds);
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const viewportSize = VIEWPORT_SIZE;

  const elementListRangeRef = useRef<any | null>(null);
  const [elementListRange, setElementListRange] = useState<any | null>(null);

  useEffect(() => {
    const els = elementList.filter((el) => activeElementIdList.includes(el.id));
    if (!els.length) return setElementListRange(null);
    const range = getElementListRange(els);
    elementListRangeRef.current = range;
    setElementListRange(range);
  }, [elementList, activeElementIdList]);

  const markerSize = useMemo(() => {
    return (viewportStyles.width * canvasScale) / (viewportSize / 100);
  }, [viewportStyles.width, canvasScale, viewportSize]);

  return (
    <div className="ruler">
      <div
        className="h"
        style={{
          width: viewportStyles.width * canvasScale + 'px',
          left: viewportStyles.left + 'px',
        }}
      >
        {Array.from({ length: 20 }, (_, marker) => (
          <div
            key={`h-marker-100-${marker + 1}`}
            className={`ruler-marker-100 ${markerSize < 36 ? 'hide' : ''} ${markerSize < 72 ? 'omit' : ''}`}
            style={{ width: markerSize + 'px' }}
          >
            <span
              style={{
                display: (marker + 1) * 100 <= viewportSize ? 'inline' : 'none',
              }}
            >
              {(marker + 1) * 100}
            </span>
          </div>
        ))}
        {elementListRange && (
          <div
            className="range"
            style={{
              left: elementListRange.minX * canvasScale + 'px',
              width:
                (elementListRange.maxX - elementListRange.minX) * canvasScale +
                'px',
            }}
          ></div>
        )}
      </div>
      <div
        className="v"
        style={{
          height: viewportStyles.height * canvasScale + 'px',
          top: viewportStyles.top + 'px',
        }}
      >
        {Array.from({ length: 20 }, (_, marker) => (
          <div
            key={`v-marker-100-${marker + 1}`} // 修改此处，从1开始
            className={`ruler-marker-100 ${markerSize < 36 ? 'hide' : ''} ${markerSize < 72 ? 'omit' : ''}`}
            style={{ height: markerSize + 'px' }}
          >
            <span
              style={{
                display:
                  (marker + 1) * 100 <= viewportSize * viewportRatio // 修改此处，从1开始
                    ? 'inline'
                    : 'none',
              }}
            >
              {(marker + 1) * 100}
            </span>
          </div>
        ))}
        {elementListRange && (
          <div
            className="range"
            style={{
              top: elementListRange.minY * canvasScale + 'px',
              height:
                (elementListRange.maxY - elementListRange.minY) * canvasScale +
                'px',
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Ruler;
