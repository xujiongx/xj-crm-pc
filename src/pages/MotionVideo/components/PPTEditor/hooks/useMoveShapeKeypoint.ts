import { SHAPE_PATH_FORMULAS } from '@/pages/MotionVideo/config/shapes';
import { PPTElement, PPTShapeElement } from '@/pages/MotionVideo/interface';
import { useEffect, useRef } from 'react';
import { useSlidesStore } from '../store';
import useHistorySnapshot from './useHistorySnapshot';

interface ShapePathData {
  baseSize: number;
  originPos: number;
  min: number;
  max: number;
  relative: string;
}

const MoveShapeKeypointComponent = (
  elementList: PPTElement[],
  canvasScale: number,
) => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const elementListRef = useRef<PPTElement[]>([]);
  const canvasScaleRef = useRef(0);

  const updateSlide = useSlidesStore((store) => store.updateSlide);

  const moveShapeKeypoint = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTShapeElement,
    index = 0,
  ) => {
    let isMouseDown = true;
    const startPageX = e.pageX;
    const startPageY = e.pageY;

    const originKeypoints = element.keypoints!;

    const pathFormula = SHAPE_PATH_FORMULAS[element.pathFormula!];
    let shapePathData: ShapePathData | null = null;
    if ('editable' in pathFormula && pathFormula.editable) {
      const getBaseSize = pathFormula.getBaseSize![index];
      const range = pathFormula.range![index];
      const relative = pathFormula.relative![index];
      const keypoint = originKeypoints[index];

      const baseSize = getBaseSize(element.width, element.height);
      const originPos = baseSize * keypoint;
      const [min, max] = range;

      shapePathData = { baseSize, originPos, min, max, relative };
    }

    const handleMousemove = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
      if (!isMouseDown) return;

      const currentPageX = e.pageX;
      const currentPageY = e.pageY;
      const moveX = (currentPageX - startPageX) / canvasScaleRef.current;
      const moveY = (currentPageY - startPageY) / canvasScaleRef.current;

      elementListRef.current = elementListRef.current.map((el) => {
        if (el.id === element.id && shapePathData) {
          const { baseSize, originPos, min, max, relative } = shapePathData;
          const shapeElement = el as PPTShapeElement;

          let keypoint = 0;

          if (relative === 'center')
            keypoint = (originPos - moveX * 2) / baseSize;
          else if (relative === 'left')
            keypoint = (originPos + moveX) / baseSize;
          else if (relative === 'right')
            keypoint = (originPos - moveX) / baseSize;
          else if (relative === 'top')
            keypoint = (originPos + moveY) / baseSize;
          else if (relative === 'bottom')
            keypoint = (originPos - moveY) / baseSize;
          else if (relative === 'left_bottom')
            keypoint = (originPos + moveX) / baseSize;
          else if (relative === 'right_bottom')
            keypoint = (originPos - moveX) / baseSize;
          else if (relative === 'top_right')
            keypoint = (originPos + moveY) / baseSize;
          else if (relative === 'bottom_right')
            keypoint = (originPos - moveY) / baseSize;

          if (keypoint < min) keypoint = min;
          if (keypoint > max) keypoint = max;

          let keypoints: number[] = [];
          if (Array.isArray(originKeypoints)) {
            keypoints = [...originKeypoints];
            keypoints[index] = keypoint;
          } else keypoints = [keypoint];

          console.log('😤', el, shapePathData);

          return {
            ...el,
            keypoints,
            path: pathFormula.formula(
              shapeElement.viewBox[0],
              shapeElement.viewBox[1],
              keypoints,
            ),
          };
        }
        return el;
      });
      if (startPageX === currentPageX && startPageY === currentPageY) return;

      updateSlide({ elements: elementListRef.current });
      addHistorySnapshot();
    };

    const handleMouseup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      isMouseDown = false;

      document.ontouchmove = null;
      document.ontouchend = null;
      document.onmousemove = null;
      document.onmouseup = null;

      const currentPageX = e.pageX;
      const currentPageY = e.pageY;

      if (startPageX === currentPageX && startPageY === currentPageY) return;

      updateSlide({ elements: elementListRef.current });
      addHistorySnapshot();
    };

    document.onmousemove = handleMousemove;
    document.onmouseup = handleMouseup;
  };
  useEffect(() => {
    elementListRef.current = elementList;
    canvasScaleRef.current = canvasScale;
  }, [elementList, canvasScale]);

  return {
    moveShapeKeypoint,
  };
};

export default MoveShapeKeypointComponent;
