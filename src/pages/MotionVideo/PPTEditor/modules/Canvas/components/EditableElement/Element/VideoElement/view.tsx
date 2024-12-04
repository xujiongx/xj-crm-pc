import { useMemo } from 'react';
import { computeShadowStyle } from '../utils';
import styles from './index.less';
import { PPTVideoElement } from '../../../../../../interface'

interface ElementProps {
  element: PPTVideoElement;
}

const VideoView = ({ element }: ElementProps) => {
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
            <video
              src={element.src}
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              onDragStart={(e) => e.preventDefault()}
              poster={element.poster}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;
