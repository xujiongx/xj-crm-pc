import { HistorySnapshot } from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { KeyboardStore } from '@/pages/MotionVideo/components/PPTEditor/store/keyboard';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import clsx from 'clsx';

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
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useKeyboardStore: KeyboardStore;
    useHistorySnapshot: HistorySnapshot;
  };
}

const ImageElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
  store,
}: ImageElementOperateProps) => {
  const { useMainStore } = store;
  const canvasScale = useMainStore((store) => store.canvasScale);
  const clipingImageElementId = useMainStore(
    (store) => store.clipingImageElementId,
  );

  const scaleWidth = element.width * canvasScale;
  const scaleHeight = element.height * canvasScale;

  const { resizeHandlers, borderLines } = useOperate(scaleWidth, scaleHeight);

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
