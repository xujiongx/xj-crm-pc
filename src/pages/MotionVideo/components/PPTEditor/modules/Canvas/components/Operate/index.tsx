import clsx from 'clsx';

import {
  useKeyboardStore,
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { ElementOperateTypeMap } from '@/pages/MotionVideo/elements/Operate';
import {
  OperateResizeHandlers,
  PPTElement,
  PPTShapeElement,
} from '@/pages/MotionVideo/interface';
import useHistorySnapshot from '../../../../hooks/useHistorySnapshot';
import styles from './index.less';

interface OperateProps {
  element: PPTElement;
  isSelected?: boolean;
  onRotate: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: PPTElement,
  ) => void;
  onScale: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: PPTElement,
    command: OperateResizeHandlers,
  ) => void;
  moveShapeKeypoint: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTShapeElement,
    index: number,
  ) => void;
  isActive: boolean;
  isMultiSelect: boolean;
  isActiveGroupElement: boolean;
}

const Operate = ({
  element,
  isSelected,
  onRotate,
  onScale,
  moveShapeKeypoint,
  isMultiSelect,
  isActive,
  isActiveGroupElement,
}: OperateProps) => {
  const canvasScale = useMainStore((store) => store.canvasScale);

  const rotate = 'rotate' in element ? element.rotate : 0;
  const height = 'height' in element ? element.height : 0;

  const Component = ElementOperateTypeMap[element.type];

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  if (hiddenElementIdList.includes(element.id)) {
    return null;
  }

  return (
    <div
      className={clsx({
        [styles.operate]: true,
        [styles['multi-select']]: isMultiSelect && !isActive,
      })}
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
          handlerVisible={isActiveGroupElement || !isMultiSelect}
          onRotate={onRotate}
          onScale={onScale}
          moveShapeKeypoint={moveShapeKeypoint}
          store={{
            useMainStore,
            useSlidesStore,
            useKeyboardStore,
            useHistorySnapshot,
          }}
        />
      )}
    </div>
  );
};

export default Operate;
