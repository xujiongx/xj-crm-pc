import { useMemo } from 'react';
import { PPTImageElement } from '../../../interface';
import { computeShadowStyle } from '../utils';
import styles from './index.less';

interface ImageElementProps {
  element: PPTImageElement;
  onSelect: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTImageElement,
    canMove?: boolean,
  ) => void;
}

const ImageElement = ({ element, onSelect }: ImageElementProps) => {
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (element.lock) return;
    e.stopPropagation();
    onSelect(e, element);
  };

  const flipStyle = useMemo(() => {
    let style = '';
    if (element.flipH && element.flipV)
      style = 'rotateX(180deg) rotateY(180deg)';
    else if (element.flipV) style = 'rotateX(180deg)';
    else if (element.flipH) style = 'rotateY(180deg)';
    return style;
  }, [element.flipV, element.flipH]);

  const shadowStyle = useMemo(
    () => computeShadowStyle(element.shadow),
    [element.shadow],
  );

  return (
    <div
      className={styles['image-element']}
      style={{
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
        borderRadius: `${element.radius}px`,
        overflow: 'hidden',
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{
          transform: `rotate(${element.rotate}deg)`,
        }}
      >
        <div
          onMouseDown={onMouseDown}
          className={styles['element-content']}
          style={{
            filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
            transform: flipStyle,
          }}
        >
          <div className={styles['image-content']}>
            <img
              src={element.src}
              alt=""
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageElement;
