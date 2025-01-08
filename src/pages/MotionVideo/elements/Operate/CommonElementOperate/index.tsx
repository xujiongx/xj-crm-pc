import { HistorySnapshot } from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { KeyboardStore } from '@/pages/MotionVideo/components/PPTEditor/store/keyboard';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';

import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import {
  OperateResizeHandlers,
  PPTImageElement,
} from '@/pages/MotionVideo/interface';
import useOperate from '../../hooks/useOperate';
import BorderLine from '../../common/Operate/BorderLine';
import Resize from '../../common/Operate/Resize';
import Rotate from '../../common/Operate/Rotate';
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
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useKeyboardStore: KeyboardStore;
    useHistorySnapshot: HistorySnapshot;
  };
}

const CommonElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
  store,
}: ElementOperateProps) => {
  const { useMainStore } = store;
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
