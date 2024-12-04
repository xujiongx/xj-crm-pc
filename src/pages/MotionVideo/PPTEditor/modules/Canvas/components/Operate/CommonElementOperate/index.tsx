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

interface ElementOperateProps {
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

const CommonElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
}: ElementOperateProps) => {
  const canvasScale = useMainStore((store) => store.canvasScale);

  const scaleWidth = element.width * canvasScale;
  const scaleHeight = element.height * canvasScale;

  const { resizeHandlers, borderLines } = useOperate(scaleWidth, scaleHeight);

  return (
    <div className={styles['image-element-operate']}>
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

export default CommonElementOperate;
