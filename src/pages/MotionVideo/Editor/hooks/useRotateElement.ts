import { PPTElement } from '../interface';
import useSlidesStore from '../store/slides';
import useHistorySnapshot from './useHistorySnapshot';
/**
 * 计算给定坐标到原点连线的弧度
 * @param x 坐标x
 * @param y 坐标y
 */
const getAngleFromCoordinate = (x: number, y: number) => {
  const radian = Math.atan2(x, y);
  const angle = (180 / Math.PI) * radian;
  return angle;
};

const useRotateElement = (
  elements: PPTElement[],
  viewportRef: React.RefObject<HTMLDivElement>,
  canvasScale: number,
) => {
  const { updateSlide } = useSlidesStore();
  const historySnapshot = useHistorySnapshot();

  const rotate = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTElement,
  ) => {
    e.stopPropagation();
    let isMouseDown = true;
    let angle = 0;
    const elOriginRotate = element.rotate || 0;

    const elLeft = element.left;
    const elTop = element.top;
    const elWidth = element.width;
    const elHeight = element.height;

    // 元素中心点（旋转中心点）
    const centerX = elLeft + elWidth / 2;
    const centerY = elTop + elHeight / 2;

    if (!viewportRef.current) return;
    const viewportRect = viewportRef.current.getBoundingClientRect();

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;

      const currentPageX =
        e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
      const currentPageY =
        e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY;

      // 计算当前鼠标位置相对元素中心点连线的角度（弧度）
      const mouseX = (currentPageX - viewportRect.left) / canvasScale;
      const mouseY = (currentPageY - viewportRect.top) / canvasScale;
      const x = mouseX - centerX;
      const y = centerY - mouseY;

      angle = getAngleFromCoordinate(x, y);

      // 靠近45倍数的角度时有吸附效果
      const sorptionRange = 5;
      if (Math.abs(angle) <= sorptionRange) angle = 0;
      else if (angle > 0 && Math.abs(angle - 45) <= sorptionRange)
        angle -= angle - 45;
      else if (angle < 0 && Math.abs(angle + 45) <= sorptionRange)
        angle -= angle + 45;
      else if (angle > 0 && Math.abs(angle - 90) <= sorptionRange)
        angle -= angle - 90;
      else if (angle < 0 && Math.abs(angle + 90) <= sorptionRange)
        angle -= angle + 90;
      else if (angle > 0 && Math.abs(angle - 135) <= sorptionRange)
        angle -= angle - 135;
      else if (angle < 0 && Math.abs(angle + 135) <= sorptionRange)
        angle -= angle + 135;
      else if (angle > 0 && Math.abs(angle - 180) <= sorptionRange)
        angle -= angle - 180;
      else if (angle < 0 && Math.abs(angle + 180) <= sorptionRange)
        angle -= angle + 180;

      elements = elements.map((el) =>
        element.id === el.id ? { ...el, rotate: angle } : el,
      );
      updateSlide({ elements });
    };

    const handleMouseup = () => {
      isMouseDown = false;
      document.onmousemove = null;
      document.onmouseup = null;

      if (elOriginRotate === angle) return;
      updateSlide({ elements });
      historySnapshot.add();
    };

    document.onmousemove = handleMousemove;
    document.onmouseup = handleMouseup;
  };

  return {
    rotate,
  };
};

export default useRotateElement;
