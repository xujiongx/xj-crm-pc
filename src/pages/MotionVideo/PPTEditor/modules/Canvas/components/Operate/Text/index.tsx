import useOperate from '../../../../../hooks/useOperate';
import { OperateResizeHandlers, PPTTextElement } from '../../../../../interface';
import useMainStore from '../../../../../store/main';
import BorderLine from '../component/BorderLine';
import Resize from '../component/Resize';
import Rotate from '../component/Rotate';
import styles from './index.less';

interface TextElementOperateProps {
  element: PPTTextElement;
  handlerVisible?: boolean;
  onRotate: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTTextElement,
  ) => void;
  onScale: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTTextElement,
    command: OperateResizeHandlers,
  ) => void;
}

const TextElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
}: TextElementOperateProps) => {
  const canvasScale = useMainStore((store) => store.canvasScale);

  const scaleWidth = element.width * canvasScale;
  const scaleHeight = element.height * canvasScale;

  const {
    textElementResizeHandlers,
    verticalTextElementResizeHandlers,
    borderLines,
  } = useOperate(scaleWidth, scaleHeight);

  const resizeHandlers = element.vertical
    ? verticalTextElementResizeHandlers
    : textElementResizeHandlers;

  return (
    <div className={styles['text-element-operate']}>
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

export default TextElementOperate;
