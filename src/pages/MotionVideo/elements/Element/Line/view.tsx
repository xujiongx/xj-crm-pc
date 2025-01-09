import { PPTLineElement } from '@/pages/MotionVideo/interface';
import { useMemo } from 'react';
import useElementShadow from '../../hooks/useElementShadow';
import { getLineElementPath } from '../../utils/element';
import LinePointMarker from './LinePointMarker';
import './view.less';

interface LineViewProps {
  element: PPTLineElement;
}

const LineView = ({ element }: LineViewProps) => {
  const { shadowStyle } = useElementShadow(element.shadow);

  const svgWidth = useMemo(() => {
    const width = Math.abs(element.start[0] - element.end[0]);
    return width < 24 ? 24 : width;
  }, [element.start, element.end]);

  const svgHeight = useMemo(() => {
    const height = Math.abs(element.start[1] - element.end[1]);
    return height < 24 ? 24 : height;
  }, [element.start, element.end]);

  const lineDashArray = useMemo(() => {
    const size = element.width;
    if (element.style === 'dashed')
      return size <= 8
        ? `${size * 5} ${size * 2.5}`
        : `${size * 5} ${size * 1.5}`;
    if (element.style === 'dotted')
      return size <= 8
        ? `${size * 1.8} ${size * 1.6}`
        : `${size * 1.5} ${size * 1.2}`;
    return '0 0';
  }, [element.width, element.style]);

  const path = useMemo(() => getLineElementPath(element), [element]);

  return (
    <div
      className="editable-element-shape"
      style={{ top: `${element.top}px`, left: `${element.left}px` }}
    >
      <div
        className="element-content"
        style={{ filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '' }}
      >
        <svg overflow="visible" width={svgWidth} height={svgHeight}>
          <defs>
            {element.points[0] && (
              <LinePointMarker
                id={element.id}
                position="start"
                type={element.points[0]}
                color={element.color}
                baseSize={element.width}
              />
            )}
            {element.points[1] && (
              <LinePointMarker
                id={element.id}
                position="end"
                type={element.points[1]}
                color={element.color}
                baseSize={element.width}
              />
            )}
          </defs>
          <path
            d={path}
            stroke={element.color}
            strokeWidth={element.width}
            strokeDasharray={lineDashArray}
            fill="none"
            markerStart={
              element.points[0]
                ? `url(#${element.id}-${element.points[0]}-start)`
                : ''
            }
            markerEnd={
              element.points[1]
                ? `url(#${element.id}-${element.points[1]}-end)`
                : ''
            }
          />
        </svg>
      </div>
    </div>
  );
};

export default LineView;
