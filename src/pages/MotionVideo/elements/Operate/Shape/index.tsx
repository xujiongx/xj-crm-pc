import { HistorySnapshot } from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { KeyboardStore } from '@/pages/MotionVideo/components/PPTEditor/store/keyboard';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import { SHAPE_PATH_FORMULAS } from '@/pages/MotionVideo/config/shapes';
import {
  OperateResizeHandlers,
  PPTShapeElement,
} from '@/pages/MotionVideo/interface';
import { useEffect, useState } from 'react';
import useOperate from '../../hooks/useOperate';

import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import BorderLine from '../../common/Operate/BorderLine';
import Resize from '../../common/Operate/Resize';
import Rotate from '../../common/Operate/Rotate';
import styles from './index.less';

interface ElementOperateProps {
  element: PPTShapeElement;
  handlerVisible?: boolean;
  onRotate: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTShapeElement,
  ) => void;
  onScale: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTShapeElement,
    command: OperateResizeHandlers,
  ) => void;
  moveShapeKeypoint: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTShapeElement,
    index: number,
  ) => void;
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useKeyboardStore: KeyboardStore;
    useHistorySnapshot: HistorySnapshot;
  };
}

const ShapeElementOperate = ({
  element,
  handlerVisible,
  onRotate,
  onScale,
  moveShapeKeypoint,
  store,
}: ElementOperateProps) => {
  const { useMainStore } = store;
  const canvasScale = useMainStore((store) => store.canvasScale);

  const scaleWidth = element.width * canvasScale;
  const scaleHeight = element.height * canvasScale;

  const { resizeHandlers, borderLines } = useOperate(scaleWidth, scaleHeight);
  const [keypoints, setKeypoints] = useState<any[]>([]);

  useEffect(() => {
    if (!element.pathFormula || element.keypoints === undefined) {
      setKeypoints([]);
      return;
    }

    const pathFormula = SHAPE_PATH_FORMULAS[element.pathFormula];
    const newKeypoints = element.keypoints.map((keypoint, index) => {
      const getBaseSize = pathFormula.getBaseSize![index];
      const relative = pathFormula.relative![index];
      const keypointPos = getBaseSize(element.width, element.height) * keypoint;

      let styles: React.CSSProperties = {};
      if (relative === 'left')
        styles = { left: keypointPos * canvasScale + 'px' };
      else if (relative === 'right')
        styles = {
          left: (element.width - keypointPos) * canvasScale + 'px',
        };
      else if (relative === 'center')
        styles = {
          left: ((element.width - keypointPos) / 2) * canvasScale + 'px',
        };
      else if (relative === 'top')
        styles = { top: keypointPos * canvasScale + 'px' };
      else if (relative === 'bottom')
        styles = {
          top: (element.height - keypointPos) * canvasScale + 'px',
        };
      else if (relative === 'left_bottom')
        styles = {
          left: keypointPos * canvasScale + 'px',
          top: element.height * canvasScale + 'px',
        };
      else if (relative === 'right_bottom')
        styles = {
          left: (element.width - keypointPos) * canvasScale + 'px',
          top: element.height * canvasScale + 'px',
        };
      else if (relative === 'top_right')
        styles = {
          left: element.width * canvasScale + 'px',
          top: keypointPos * canvasScale + 'px',
        };
      else if (relative === 'bottom_right')
        styles = {
          left: element.width * canvasScale + 'px',
          top: (element.height - keypointPos) * canvasScale + 'px',
        };

      return {
        keypoint,
        styles,
      };
    });

    setKeypoints(newKeypoints);
  }, [element, canvasScale]);

  return (
    <div className={styles['element-operate']}>
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
          {keypoints.map((keypoint, index) => (
            <div
              key={index}
              className={styles['operate-keypoint-handler']}
              style={keypoint.styles}
              onMouseDown={(e) => {
                e.stopPropagation();
                moveShapeKeypoint(e, element, index);
              }}
            ></div>
          ))}
        </>
      )}
    </div>
  );
};

export default ShapeElementOperate;
