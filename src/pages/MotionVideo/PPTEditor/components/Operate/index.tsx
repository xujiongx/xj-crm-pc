import clsx from 'clsx';
import {
  ElementTypes,
  OperateResizeHandlers,
  PPTElement,
} from '../../interface';
import useMainStore from '../../store/main';
import ImageElementOperate from './Image';
import TextElementOperate from './Text';
import styles from './index.less';

interface OperateProps {
  element: PPTElement;
  isSelected?: boolean;
  isActive?: boolean;
  onRotate: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: PPTElement,
  ) => void;
  onScale: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: PPTElement,
    command: OperateResizeHandlers,
  ) => void;
}

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextElementOperate,
  [ElementTypes.IMAGE]: ImageElementOperate,
};

const Operate = ({ element, isSelected, onRotate, onScale }: OperateProps) => {
  const canvasScale = useMainStore((store) => store.canvasScale);

  const rotate = 'rotate' in element ? element.rotate : 0;
  const height = 'height' in element ? element.height : 0;

  const Component = ElementTypeMap[element.type];

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  if (hiddenElementIdList.includes(element.id)) {
    return null;
  }

  return (
    <div
      className={clsx(styles.operate)}
      style={{
        top: element.top * canvasScale + 'px',
        left: element.left * canvasScale + 'px',
        transform: `rotate(${rotate}deg)`,
        transformOrigin: `${(element.width * canvasScale) / 2}px ${
          (height * canvasScale) / 2
        }px`,
      }}
    >
      {isSelected && (
        <Component
          element={element as never}
          handlerVisible
          onRotate={onRotate}
          onScale={onScale}
        />
      )}
    </div>
  );
};

export default Operate;
