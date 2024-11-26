import {
  AlignLine,
  AlignmentLineProps,
  OperateResizeHandlers,
  PPTElement,
} from '../interface';
import useKeyboardStore from '../store/keyboard';
import useMainStore from '../store/main';
import useSlidesStore from '../store/slides';
import { uniqAlignLines } from '../utils/element';
import useHistorySnapshot from './useHistorySnapshot';
import { VIEWPORT_SIZE } from './useViewportSize';

export const MIN_SIZE: { [key: string]: number } = {
  text: 20,
};

interface RotateElementData {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * 计算旋转后的元素八个缩放点的位置
 * @param element 元素原始位置大小信息
 * @param angle 旋转角度
 */
const getRotateElementPoints = (element: RotateElementData, angle: number) => {
  const { left, top, width, height } = element;

  const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
  const auxiliaryAngle = (Math.atan(height / width) * 180) / Math.PI;

  const tlbraRadian = ((180 - angle - auxiliaryAngle) * Math.PI) / 180;
  const trblaRadian = ((auxiliaryAngle - angle) * Math.PI) / 180;
  const taRadian = ((90 - angle) * Math.PI) / 180;
  const raRadian = (angle * Math.PI) / 180;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const middleLeft = left + halfWidth;
  const middleTop = top + halfHeight;

  const leftTopPoint = {
    left: middleLeft + radius * Math.cos(tlbraRadian),
    top: middleTop - radius * Math.sin(tlbraRadian),
  };
  const topPoint = {
    left: middleLeft + halfHeight * Math.cos(taRadian),
    top: middleTop - halfHeight * Math.sin(taRadian),
  };
  const rightTopPoint = {
    left: middleLeft + radius * Math.cos(trblaRadian),
    top: middleTop - radius * Math.sin(trblaRadian),
  };
  const rightPoint = {
    left: middleLeft + halfWidth * Math.cos(raRadian),
    top: middleTop + halfWidth * Math.sin(raRadian),
  };
  const rightBottomPoint = {
    left: middleLeft - radius * Math.cos(tlbraRadian),
    top: middleTop + radius * Math.sin(tlbraRadian),
  };
  const bottomPoint = {
    left: middleLeft - halfHeight * Math.sin(raRadian),
    top: middleTop + halfHeight * Math.cos(raRadian),
  };
  const leftBottomPoint = {
    left: middleLeft - radius * Math.cos(trblaRadian),
    top: middleTop + radius * Math.sin(trblaRadian),
  };
  const leftPoint = {
    left: middleLeft - halfWidth * Math.cos(raRadian),
    top: middleTop - halfWidth * Math.sin(raRadian),
  };

  return {
    leftTopPoint,
    topPoint,
    rightTopPoint,
    rightPoint,
    rightBottomPoint,
    bottomPoint,
    leftBottomPoint,
    leftPoint,
  };
};

/**
 * 获取元素某缩放点相对的另一个点的位置，如：【上】对应【下】、【左上】对应【右下】
 * @param direction 当前操作的缩放点
 * @param points 旋转后的元素八个缩放点的位置
 */
const getOppositePoint = (
  direction: OperateResizeHandlers,
  points: ReturnType<typeof getRotateElementPoints>,
): { left: number; top: number } => {
  const oppositeMap = {
    [OperateResizeHandlers.RIGHT_BOTTOM]: points.leftTopPoint,
    [OperateResizeHandlers.LEFT_BOTTOM]: points.rightTopPoint,
    [OperateResizeHandlers.LEFT_TOP]: points.rightBottomPoint,
    [OperateResizeHandlers.RIGHT_TOP]: points.leftBottomPoint,
    [OperateResizeHandlers.TOP]: points.bottomPoint,
    [OperateResizeHandlers.BOTTOM]: points.topPoint,
    [OperateResizeHandlers.LEFT]: points.rightPoint,
    [OperateResizeHandlers.RIGHT]: points.leftPoint,
  };
  return oppositeMap[direction];
};

const useScaleElement = (
  elements: PPTElement[],
  lines: AlignmentLineProps[],
  canvasScale: number,
) => {
  const { updateSlide } = useSlidesStore();
  const { setScalingState } = useMainStore();
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const historySnapshot = useHistorySnapshot();

  const scale = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTElement,
    command: OperateResizeHandlers,
  ) => {
    e.stopPropagation();
    let isMouseDown = true;
    setScalingState(true);
    const elOriginLeft = element.left;
    const elOriginTop = element.top;
    const elOriginWidth = element.width;
    const elOriginHeight = element.height;

    const elRotate = 'rotate' in element && element.rotate ? element.rotate : 0;
    const rotateRadian = (Math.PI * elRotate) / 180;

    const aspectRatio = elOriginWidth / elOriginHeight;

    const startPageX = e.pageX;
    const startPageY = e.pageY;

    // 元素最小缩放限制
    const minSize = MIN_SIZE[element.type] || 20;
    const getSizeWithinRange = (size: number) =>
      size < minSize ? minSize : size;

    let points: ReturnType<typeof getRotateElementPoints>;
    let baseLeft = 0;
    let baseTop = 0;
    let horizontalLines: AlignLine[] = [];
    let verticalLines: AlignLine[] = [];

    // 旋转后的元素进行缩放时，引入基点的概念，以当前操作的缩放点相对的点为基点
    // 例如拖动右下角缩放时，左上角为基点，需要保持左上角不变然后修改其他的点的位置来达到所放的效果
    if ('rotate' in element && element.rotate) {
      const { left, top, width, height } = element;
      points = getRotateElementPoints({ left, top, width, height }, elRotate);
      const oppositePoint = getOppositePoint(command, points);

      baseLeft = oppositePoint.left;
      baseTop = oppositePoint.top;
    }
    // 未旋转的元素具有缩放时的对齐吸附功能，在此处收集对齐对齐吸附线
    // 包括页面内除目标元素外的其他元素在画布中的各个可吸附对齐位置：上下左右四边
    // 其中线条和被旋转过的元素不参与吸附对齐
    else {
      const edgeWidth = VIEWPORT_SIZE;
      const edgeHeight = VIEWPORT_SIZE * viewportRatio;

      for (const el of elements) {
        if ('rotate' in el && el.rotate) continue;
        // if (el.type === 'line') continue;
        if (el.id === element.id) continue;
        if (activeElementIds.includes(el.id)) continue;

        const left = el.left;
        const top = el.top;
        const width = el.width;
        const height = el.height;
        const right = left + width;
        const bottom = top + height;

        const topLine: AlignLine = { value: top, range: [left, right] };
        const bottomLine: AlignLine = { value: bottom, range: [left, right] };
        const leftLine: AlignLine = { value: left, range: [top, bottom] };
        const rightLine: AlignLine = { value: right, range: [top, bottom] };

        horizontalLines.push(topLine, bottomLine);
        verticalLines.push(leftLine, rightLine);
      }

      // 画布可视区域的四个边界、水平中心、垂直中心
      const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] };
      const edgeBottomLine: AlignLine = {
        value: edgeHeight,
        range: [0, edgeWidth],
      };
      const edgeHorizontalCenterLine: AlignLine = {
        value: edgeHeight / 2,
        range: [0, edgeWidth],
      };
      const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] };
      const edgeRightLine: AlignLine = {
        value: edgeWidth,
        range: [0, edgeHeight],
      };
      const edgeVerticalCenterLine: AlignLine = {
        value: edgeWidth / 2,
        range: [0, edgeHeight],
      };

      horizontalLines.push(
        edgeTopLine,
        edgeBottomLine,
        edgeHorizontalCenterLine,
      );
      verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine);

      horizontalLines = uniqAlignLines(horizontalLines);
      verticalLines = uniqAlignLines(verticalLines);
    }

    // 对齐吸附方法
    // 将收集到的对齐吸附线与计算的目标元素当前的位置大小相关数据做对比，差值小于设定的值时执行自动缩放校正
    // 水平和垂直两个方向需要分开计算
    const alignedAdsorption = (
      currentX: number | null,
      currentY: number | null,
    ) => {
      const sorptionRange = 5;

      const _alignmentLines: AlignmentLineProps[] = [];
      let isVerticalAdsorbed = false;
      let isHorizontalAdsorbed = false;
      const correctionVal = { offsetX: 0, offsetY: 0 };

      if (currentY || currentY === 0) {
        for (let i = 0; i < horizontalLines.length; i++) {
          const { value, range } = horizontalLines[i];
          const min = Math.min(...range, currentX || 0);
          const max = Math.max(...range, currentX || 0);

          if (
            Math.abs(currentY - value) < sorptionRange &&
            !isHorizontalAdsorbed
          ) {
            correctionVal.offsetY = currentY - value;
            isHorizontalAdsorbed = true;
            _alignmentLines.push({
              type: 'horizontal',
              axis: { x: min - 50, y: value },
              length: max - min + 100,
            });
          }
        }
      }
      if (currentX || currentX === 0) {
        for (let i = 0; i < verticalLines.length; i++) {
          const { value, range } = verticalLines[i];
          const min = Math.min(...range, currentY || 0);
          const max = Math.max(...range, currentY || 0);

          if (
            Math.abs(currentX - value) < sorptionRange &&
            !isVerticalAdsorbed
          ) {
            correctionVal.offsetX = currentX - value;
            isVerticalAdsorbed = true;
            _alignmentLines.push({
              type: 'vertical',
              axis: { x: value, y: min - 50 },
              length: max - min + 100,
            });
          }
        }
      }
      lines = _alignmentLines;
      return correctionVal;
    };

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;

      const { ctrlKeyState, shiftKeyState } = useKeyboardStore.getState();

      const fixedRatio =
        ctrlKeyState ||
        shiftKeyState ||
        ('fixedRatio' in element && element.fixedRatio);

      console.log(
        ctrlKeyState || shiftKeyState,
        'fixedRatio' in element && element.fixedRatio,
      );

      const currentPageX =
        e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
      const currentPageY =
        e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY;

      const x = currentPageX - startPageX;
      const y = currentPageY - startPageY;

      let width = elOriginWidth;
      let height = elOriginHeight;
      let left = elOriginLeft;
      let top = elOriginTop;

      // 元素被旋转的情况下，需要根据元素旋转的角度，重新计算需要缩放的距离（鼠标按下后移动的距离）
      if (elRotate) {
        const revisedX =
          (Math.cos(rotateRadian) * x + Math.sin(rotateRadian) * y) /
          canvasScale;
        let revisedY =
          (Math.cos(rotateRadian) * y - Math.sin(rotateRadian) * x) /
          canvasScale;

        // 锁定宽高比例（仅四个角可能触发，四条边不会触发）
        // 以水平方向上缩放的距离为基础，计算垂直方向上的缩放距离，保持二者具有相同的缩放比例
        if (fixedRatio) {
          if (
            command === OperateResizeHandlers.RIGHT_BOTTOM ||
            command === OperateResizeHandlers.LEFT_TOP
          )
            revisedY = revisedX / aspectRatio;
          if (
            command === OperateResizeHandlers.LEFT_BOTTOM ||
            command === OperateResizeHandlers.RIGHT_TOP
          )
            revisedY = -revisedX / aspectRatio;
        }

        // 根据不同的操作点分别计算元素缩放后的大小和位置
        // 需要注意：
        // 此处计算的位置需要在后面重新进行校正，因为旋转后再缩放事实上会改变元素基点的位置（虽然视觉上基点保持不动，但这是【旋转】+【移动】共同作用的结果）
        // 但此处计算的大小不需要重新校正，因为前面已经重新计算需要缩放的距离，相当于大小已经经过了校正
        if (command === OperateResizeHandlers.RIGHT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth + revisedX);
          height = getSizeWithinRange(elOriginHeight + revisedY);
        } else if (command === OperateResizeHandlers.LEFT_BOTTOM) {
          width = getSizeWithinRange(elOriginWidth - revisedX);
          height = getSizeWithinRange(elOriginHeight + revisedY);
          left = elOriginLeft - (width - elOriginWidth);
        } else if (command === OperateResizeHandlers.LEFT_TOP) {
          width = getSizeWithinRange(elOriginWidth - revisedX);
          height = getSizeWithinRange(elOriginHeight - revisedY);
          left = elOriginLeft - (width - elOriginWidth);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.RIGHT_TOP) {
          width = getSizeWithinRange(elOriginWidth + revisedX);
          height = getSizeWithinRange(elOriginHeight - revisedY);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.TOP) {
          height = getSizeWithinRange(elOriginHeight - revisedY);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.BOTTOM) {
          height = getSizeWithinRange(elOriginHeight + revisedY);
        } else if (command === OperateResizeHandlers.LEFT) {
          width = getSizeWithinRange(elOriginWidth - revisedX);
          left = elOriginLeft - (width - elOriginWidth);
        } else if (command === OperateResizeHandlers.RIGHT) {
          width = getSizeWithinRange(elOriginWidth + revisedX);
        }

        // 获取当前元素的基点坐标，与初始状态时的基点坐标进行对比，并计算差值进行元素位置的校正
        const currentPoints = getRotateElementPoints(
          { width, height, left, top },
          elRotate,
        );
        const currentOppositePoint = getOppositePoint(command, currentPoints);
        const currentBaseLeft = currentOppositePoint.left;
        const currentBaseTop = currentOppositePoint.top;

        const offsetX = currentBaseLeft - baseLeft;
        const offsetY = currentBaseTop - baseTop;

        left = left - offsetX;
        top = top - offsetY;
      }

      // 元素未被旋转的情况下，正常计算新的位置大小即可，无需复杂的校正等工作
      // 额外需要处理对齐吸附相关的操作
      // 锁定宽高比例相关的操作同上，不再赘述
      else {
        let moveX = x / canvasScale;
        let moveY = y / canvasScale;

        if (fixedRatio) {
          if (
            command === OperateResizeHandlers.RIGHT_BOTTOM ||
            command === OperateResizeHandlers.LEFT_TOP
          )
            moveY = moveX / aspectRatio;
          if (
            command === OperateResizeHandlers.LEFT_BOTTOM ||
            command === OperateResizeHandlers.RIGHT_TOP
          )
            moveY = -moveX / aspectRatio;
        }

        if (command === OperateResizeHandlers.RIGHT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(
            elOriginLeft + elOriginWidth + moveX,
            elOriginTop + elOriginHeight + moveY,
          );
          moveX = moveX - offsetX;
          moveY = moveY - offsetY;
          if (fixedRatio) {
            if (offsetY) moveX = moveY * aspectRatio;
            else moveY = moveX / aspectRatio;
          }
          width = getSizeWithinRange(elOriginWidth + moveX);
          height = getSizeWithinRange(elOriginHeight + moveY);
        } else if (command === OperateResizeHandlers.LEFT_BOTTOM) {
          const { offsetX, offsetY } = alignedAdsorption(
            elOriginLeft + moveX,
            elOriginTop + elOriginHeight + moveY,
          );
          moveX = moveX - offsetX;
          moveY = moveY - offsetY;
          if (fixedRatio) {
            if (offsetY) moveX = -moveY * aspectRatio;
            else moveY = -moveX / aspectRatio;
          }
          width = getSizeWithinRange(elOriginWidth - moveX);
          height = getSizeWithinRange(elOriginHeight + moveY);
          left = elOriginLeft - (width - elOriginWidth);
        } else if (command === OperateResizeHandlers.LEFT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(
            elOriginLeft + moveX,
            elOriginTop + moveY,
          );
          moveX = moveX - offsetX;
          moveY = moveY - offsetY;
          if (fixedRatio) {
            if (offsetY) moveX = moveY * aspectRatio;
            else moveY = moveX / aspectRatio;
          }
          width = getSizeWithinRange(elOriginWidth - moveX);
          height = getSizeWithinRange(elOriginHeight - moveY);
          left = elOriginLeft - (width - elOriginWidth);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.RIGHT_TOP) {
          const { offsetX, offsetY } = alignedAdsorption(
            elOriginLeft + elOriginWidth + moveX,
            elOriginTop + moveY,
          );
          moveX = moveX - offsetX;
          moveY = moveY - offsetY;
          if (fixedRatio) {
            if (offsetY) moveX = -moveY * aspectRatio;
            else moveY = -moveX / aspectRatio;
          }
          width = getSizeWithinRange(elOriginWidth + moveX);
          height = getSizeWithinRange(elOriginHeight - moveY);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.LEFT) {
          const { offsetX } = alignedAdsorption(elOriginLeft + moveX, null);
          moveX = moveX - offsetX;
          width = getSizeWithinRange(elOriginWidth - moveX);
          left = elOriginLeft - (width - elOriginWidth);
        } else if (command === OperateResizeHandlers.RIGHT) {
          const { offsetX } = alignedAdsorption(
            elOriginLeft + elOriginWidth + moveX,
            null,
          );
          moveX = moveX - offsetX;
          width = getSizeWithinRange(elOriginWidth + moveX);
        } else if (command === OperateResizeHandlers.TOP) {
          const { offsetY } = alignedAdsorption(null, elOriginTop + moveY);
          moveY = moveY - offsetY;
          height = getSizeWithinRange(elOriginHeight - moveY);
          top = elOriginTop - (height - elOriginHeight);
        } else if (command === OperateResizeHandlers.BOTTOM) {
          const { offsetY } = alignedAdsorption(
            null,
            elOriginTop + elOriginHeight + moveY,
          );
          moveY = moveY - offsetY;
          height = getSizeWithinRange(elOriginHeight + moveY);
        }
      }

      elements = elements.map((el) => {
        if (element.id !== el.id) return el;
        return { ...el, left, top, width, height };
      });
      updateSlide({ elements });
    };

    const handleMouseup = (e: MouseEvent | TouchEvent) => {
      isMouseDown = false;

      document.ontouchmove = null;
      document.ontouchend = null;
      document.onmousemove = null;
      document.onmouseup = null;

      lines = [];

      const currentPageX =
        e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
      const currentPageY =
        e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY;

      if (startPageX === currentPageX && startPageY === currentPageY) return;
      updateSlide({ elements });
      setScalingState(false);
      historySnapshot.add();
    };

    document.onmousemove = handleMousemove;
    document.onmouseup = handleMouseup;
  };

  return {
    scale,
  };
};

export default useScaleElement;
