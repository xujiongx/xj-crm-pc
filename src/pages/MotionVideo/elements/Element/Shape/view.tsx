import { PPTShapeElement, ShapeText } from '@/pages/MotionVideo/interface';
import clsx from 'clsx';
import { useMemo } from 'react';
import useElementFlip from '../../hooks/useElementFlip';
import useElementOutline from '../../hooks/useElementOutline';
import useElementShadow from '../../hooks/useElementShadow';
import GradientDefs from './GradientDefs';
import styles from './view.less';

interface BaseShapeElementProps {
  element: PPTShapeElement;
}

const ShapeView = ({ element }: BaseShapeElementProps) => {
  const outline = useMemo(() => element.outline, [element]);
  const { outlineWidth, outlineColor, strokeDashArray } =
    useElementOutline(outline);

  const shadow = useMemo(() => element.shadow, [element]);
  const { shadowStyle } = useElementShadow(shadow);

  const flipH = useMemo(() => element.flipH, [element]);
  const flipV = useMemo(() => element.flipV, [element]);
  const { flipStyle } = useElementFlip(flipH, flipV);

  const text: ShapeText = {
    content: element.text?.content || '',
    defaultFontName: element.text?.defaultFontName || '微软雅黑',
    defaultColor: element.text?.defaultColor || '#000',
    align: element.text?.align || 'middle',
  };

  return (
    <div
      className={styles['editable-element-shape']}
      style={{
        top: `${element.top}px`,
        left: `${element.left}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          style={{
            opacity: element.opacity,
            filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
            transform: flipStyle,
            color: text.defaultColor,
            fontFamily: text.defaultFontName,
          }}
        >
          <svg overflow="visible" width={element.width} height={element.height}>
            {element.gradient && (
              <defs>
                <GradientDefs
                  id={`base-gradient-${element.id}`}
                  type={element.gradient.type}
                  colors={element.gradient.colors}
                  rotate={element.gradient.rotate}
                />
              </defs>
            )}
            <g
              transform={`scale(${element.width / element.viewBox[0]}, ${element.height / element.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="butt"
                strokeMiterlimit="8"
                d={element.path}
                fill={
                  element.gradient
                    ? `url(#base-gradient-${element.id})`
                    : element.fill
                }
                stroke={outlineColor}
                strokeWidth={outlineWidth}
                strokeDasharray={strokeDashArray}
              />
            </g>
          </svg>

          <div
            className={clsx({
              [styles['shape-text']]: true,
              [styles[text.align]]: true,
            })}
          >
            <div
              className={'ProseMirror-static'}
              dangerouslySetInnerHTML={{ __html: text.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeView;
