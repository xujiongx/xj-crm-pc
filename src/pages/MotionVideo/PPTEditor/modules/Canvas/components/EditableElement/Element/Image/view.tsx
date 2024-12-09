import clsx from 'clsx';
import { useMemo } from 'react';
import { PPTImageElement } from '../../../../../../interface';
import { computeShadowStyle } from '../utils';
import ImageOutline from './ImgaeOutline';
import styles from './index.less';
import { filters2Style } from './utils';
import useClipImage from './useClipImage'

interface ImageViewProps {
  element: PPTImageElement;
}

const ImageView = ({ element }: ImageViewProps) => {
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

  const { clipShape, imgPosition } = useClipImage(element);

  return (
    <div
      className={clsx({
        [styles['editable-element-image']]: true,
        [styles['lock']]: element.lock,
      })}
      style={{
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          style={{
            filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
            transform: flipStyle,
          }}
        >
          <div className={styles['image-content']}>
            <div
              className={styles['element-content']}
              style={{
                filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
                transform: flipStyle,
              }}
            >
              <ImageOutline element={element} />
              <div
                className={styles['image-content']}
                style={{
                  clipPath: clipShape.style,
                }}
              >
                <img
                  src={element.src}
                  alt=""
                  style={{
                    top: imgPosition.top,
                    left: imgPosition.left,
                    width: imgPosition.width,
                    height: imgPosition.height,
                    filter: filters2Style(element.filters || {}),
                  }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
                {element.colorMask && (
                  <div
                    className={styles['color-mask']}
                    style={{ backgroundColor: element.colorMask }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
