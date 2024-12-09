import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/store/snapshot';
import { ImageClipedEmitData } from '@/pages/MotionVideo/PPTEditor/types/edit';
import { ImageElementClip } from '@/pages/MotionVideo/PPTEditor/types/slides';
import clsx from 'clsx';
import { useMemo } from 'react';
import { PPTImageElement } from '../../../../../../interface';
import { computeShadowStyle } from '../utils';
import ImageClipHandler from './ImageClipHander';
import ImageOutline from './ImgaeOutline';
import styles from './index.less';
import useClipImage from './useClipImage';
import { filters2Style } from './utils';

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

  const clipingImageElementId = useMainStore(
    (state) => state.clipingImageElementId,
  );

  const isCliping = clipingImageElementId === element.id;

  const { clipShape, imgPosition } = useClipImage(element);

  const mainStore = useMainStore.getState();
  const slidesStore = useSlidesStore.getState();
  const addHistorySnapshot = useHistorySnapshot((store) => store.add);

  const handleClip = (data: ImageClipedEmitData | null) => {
    mainStore.setClipingImageElementId('');

    if (!data) return;

    const { range, position } = data;

    const originClip: ImageElementClip = element.clip || {
      shape: 'rect',
      range: [
        [0, 0],
        [100, 100],
      ],
    };

    const left = element.left + position.left;
    const top = element.top + position.top;
    const width = element.width + position.width;
    const height = element.height + position.height;

    let centerOffsetX = 0;
    let centerOffsetY = 0;

    if (element.rotate) {
      const centerX = left + width / 2 - (element.left + element.width / 2);
      const centerY = -(top + height / 2 - (element.top + element.height / 2));

      const radian = (-element.rotate * Math.PI) / 180;

      const rotatedCenterX =
        centerX * Math.cos(radian) - centerY * Math.sin(radian);
      const rotatedCenterY =
        centerX * Math.sin(radian) + centerY * Math.cos(radian);

      centerOffsetX = rotatedCenterX - centerX;
      centerOffsetY = -(rotatedCenterY - centerY);
    }

    const _props = {
      clip: { ...originClip, range },
      left: left + centerOffsetX,
      top: top + centerOffsetY,
      width,
      height,
    };

    slidesStore.updateElement({ id: element.id, props: _props });

    addHistorySnapshot();
  };

  console.log('🏃‍♂️', element)


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
        style={{
          transform: `rotate(${element.rotate}deg)`,
        }}
      >
        {isCliping && (
          <ImageClipHandler
            src={element.src}
            clipData={element.clip}
            width={element.width}
            height={element.height}
            top={element.top}
            left={element.left}
            rotate={element.rotate}
            clipPath={clipShape.style}
            onClip={(range) => handleClip(range)}
          />
        )}
        {!isCliping && (
          <div
            onMouseDown={onMouseDown}
            className={styles['element-content']}
            style={{
              filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
              transform: flipStyle,
            }}
          >
            {/* 图片裁剪会导致边框发生变化 */}
            {/* <ImageOutline elementInfo="elementInfo" /> */}
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
        )}
      </div>
    </div>
  );
};

export default ImageElement;
