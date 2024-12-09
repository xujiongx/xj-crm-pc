import clsx from 'clsx';
import useOperate from '../../../../../hooks/useOperate';
import {
  OperateResizeHandlers,
  PPTImageElement,
} from '../../../../../interface';
import useMainStore from '../../../../../store/main';
import BorderLine from '../component/BorderLine';
import Resize from '../component/Resize';
import Rotate from '../component/Rotate';
import styles from './index.less';

interface ImageElementOperateProps {
  element: PPTImageElement;
  handlerVisible?: boolean;
  onRotate: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTImageElement,
  ) => void;
  onScale: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTImageElement,
    command: OperateResizeHandlers,
  ) => void;
}

const ImageElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
}: ImageElementOperateProps) => {
  const canvasScale = useMainStore((store) => store.canvasScale);
  const clipingImageElementId = useMainStore(
    (store) => store.clipingImageElementId,
  );

  const scaleWidth = element.width * canvasScale;
  const scaleHeight = element.height * canvasScale;

  const { resizeHandlers, borderLines } = useOperate(scaleWidth, scaleHeight);

  console.log('👓', clipingImageElementId);


  return (
    <div
      className={clsx({
        [styles['image-element-operate']]: true,
        [styles['cliping']]: !!clipingImageElementId,
      })}
    >
      {borderLines.map((line) => (
        <BorderLine
          className={styles['operate-border-line']}
          key={line.type}
          type={line.type}
          style={line.style}
        />
      ))}
      {handlerVisible && (
        <>
          {resizeHandlers.map((point) => (
            <Resize
              key={point.direction}
              type={point.direction}
              rotate={element.rotate}
              style={point.style}
              onMouseDown={(e) => onScale(e, element, point.direction)}
            />
          ))}
          <Rotate
            style={{ left: scaleWidth / 2 }}
            onMouseDown={(e) => onRotate(e, element)}
          />
        </>
      )}
    </div>
  );
};

export default ImageElementOperate;
