import { PPTElement } from '../interface';
import { useMainStore, useSlidesStore } from '../store';
import { ElementAlignCommands } from '../types/edit';
import { getElementListRange } from '../utils/element';
import useHistorySnapshot from './useHistorySnapshot';
import { VIEWPORT_SIZE } from './useViewportSize';

export default () => {
  const slidesStore = useSlidesStore.getState();
  const currentSlide = useSlidesStore.getState().currentSlide();

  const activeElementIdList = useMainStore.getState().activeElementIds;
  const { activeElementList } = useMainStore.getState();

  const viewportRatio = useMainStore((store) => store.viewportRatio);

  const viewportSize = VIEWPORT_SIZE;

  const { add: addHistorySnapshot } = useHistorySnapshot();

  /**
   * 将所有选中的元素对齐到画布
   * @param command 对齐方向
   */
  const alignElementToCanvas = (command: ElementAlignCommands) => {
    const viewportWidth = viewportSize;
    const viewportHeight = viewportSize * viewportRatio;
    const { minX, maxX, minY, maxY } = getElementListRange(activeElementList());

    const newElementList: PPTElement[] = JSON.parse(
      JSON.stringify(currentSlide.elements),
    );
    for (const element of newElementList) {
      if (!activeElementIdList.includes(element.id)) continue;

      // 水平垂直居中
      if (command === ElementAlignCommands.CENTER) {
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2;
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2;
        element.top = element.top - offsetY;
        element.left = element.left - offsetX;
      }

      // 顶部对齐
      if (command === ElementAlignCommands.TOP) {
        const offsetY = minY - 0;
        element.top = element.top - offsetY;
      }

      // 垂直居中
      else if (command === ElementAlignCommands.VERTICAL) {
        const offsetY = minY + (maxY - minY) / 2 - viewportHeight / 2;
        element.top = element.top - offsetY;
      }

      // 底部对齐
      else if (command === ElementAlignCommands.BOTTOM) {
        const offsetY = maxY - viewportHeight;
        element.top = element.top - offsetY;
      }

      // 左侧对齐
      else if (command === ElementAlignCommands.LEFT) {
        const offsetX = minX - 0;
        element.left = element.left - offsetX;
      }

      // 水平居中
      else if (command === ElementAlignCommands.HORIZONTAL) {
        const offsetX = minX + (maxX - minX) / 2 - viewportWidth / 2;
        element.left = element.left - offsetX;
      }

      // 右侧对齐
      else if (command === ElementAlignCommands.RIGHT) {
        const offsetX = maxX - viewportWidth;
        element.left = element.left - offsetX;
      }
    }

    slidesStore.updateSlide({ elements: newElementList });
    addHistorySnapshot();
  };

  return {
    alignElementToCanvas,
  };
};