import { CreateElementSelectionData } from '../interface';
import useMainStore from '../store/main';
import useCreateElement from './useCreateElement';

const useInsertFromCreateSelection = (
  viewportRef: React.RefObject<HTMLDivElement>,
) => {
  const { canvasScale } = useMainStore((state) => state);

  // 通过鼠标框选时的起点和终点，计算选区的位置大小
  const formatCreateSelection = (selectionData: CreateElementSelectionData) => {
    const { start, end } = selectionData;

    if (!viewportRef.current) return;
    const viewportRect = viewportRef.current.getBoundingClientRect();

    const [startX, startY] = start;
    const [endX, endY] = end;
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    const left = (minX - viewportRect.x) / canvasScale;
    const top = (minY - viewportRect.y) / canvasScale;
    const width = (maxX - minX) / canvasScale;
    const height = (maxY - minY) / canvasScale;

    return { left, top, width, height };
  };

  const { createTextElement } = useCreateElement();

  // 根据鼠标选区的位置大小插入元素
  const insertElementFromCreateSelection = (
    selectionData: CreateElementSelectionData,
  ) => {
    const position = formatCreateSelection(selectionData);
    position && createTextElement(position);
  };

  return {
    insertElementFromCreateSelection,
  };
};

export default useInsertFromCreateSelection;
