import { Button } from 'antd';
import { useMemo, useRef } from 'react';
import ReactPlayer from 'react-player';
import 'video-react/dist/video-react.css';
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

const VideoElement = ({ element, onSelect }: ImageElementProps) => {
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

  console.log('😟', element);

  const ref = useRef(null);

  const handlePlay = () => {
    // ref.current?.playing = true;
    console.log('🤠', ref.current?.getInternalPlayer().play());
  };
  const handlePause = () => {
    // ref.current?.playing = true;
    console.log('🤠', ref.current?.getInternalPlayer().pause());
  };

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
          {/* <Button onClick={() => handlePlay()}>播放</Button>
          <Button onClick={() => handlePause()}>暂停</Button> */}
          <div className={styles['image-content']} id="container">
            <video
              id={`video-${element.id}`}
              src={element.src}
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              // controls
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* <ReactPlayer
              ref={ref}
              id={`video-${element.id}`}
              controls
              width={element.width}
              height={element.height}
              url={element.src}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoElement;
