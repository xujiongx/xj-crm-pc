import { PPTElement, SlideItem } from '@/pages/MotionVideo/PPTEditor/interface';
import { nanoid } from 'nanoid';
import useMainStore from '../store/main';
import slidesStore from '../store/slides';
import snapshotStore from '../store/snapshot';
import {
  createElementIdMap,
  createSlideIdMap,
  getElementRange,
} from '../utils/element';

const addSlidesOrElements = () => {
  const currentSlide = slidesStore((state) => state.currentSlide);
  const addElement = slidesStore((state) => state.addElement);
  const addSlide = slidesStore((state) => state.addSlide);
  const addHistorySnapshot = snapshotStore((state) => state.add);

  /**
   * 添加指定的元素数据（一组）
   * @param elements 元素列表数据
   */
  const addElementsFromData = (elements: PPTElement[]) => {
    const { groupIdMap, elIdMap } = createElementIdMap(elements);

    const firstElement = elements[0];
    let offset = 0;
    let lastSameElement: PPTElement | undefined;

    const findLastSameElement = (offset: number): PPTElement | undefined => {
      return currentSlide().elements.find((el) => {
        if (el.type !== firstElement.type) return false;

        const {
          minX: oMinX,
          maxX: oMaxX,
          minY: oMinY,
          maxY: oMaxY,
        } = getElementRange(el);
        const {
          minX: nMinX,
          maxX: nMaxX,
          minY: nMinY,
          maxY: nMaxY,
        } = getElementRange({
          ...firstElement,
          left: firstElement.left + offset,
          top: firstElement.top + offset,
        });
        if (
          oMinX === nMinX &&
          oMaxX === nMaxX &&
          oMinY === nMinY &&
          oMaxY === nMaxY
        )
          return true;

        return false;
      });
    };

    do {
      lastSameElement = findLastSameElement(offset);
      if (lastSameElement) offset += 10;
    } while (lastSameElement);

    for (const element of elements) {
      element.id = elIdMap[element.id];

      element.left = element.left + offset;
      element.top = element.top + offset;

      if (element.groupId) element.groupId = groupIdMap[element.groupId];
    }

    addElement(elements);
    useMainStore.getState().setActiveElementIds(Object.values(elIdMap));
    addHistorySnapshot();
  };

  /**
   * 添加指定的页面数据
   * @param slide 页面数据
   */
  const addSlidesFromData = (slides: SlideItem[]) => {
    const slideIdMap = createSlideIdMap(slides);
    const newSlides = slides.map((slide) => {
      const { groupIdMap, elIdMap } = createElementIdMap(slide.elements);

      for (const element of slide.elements) {
        element.id = elIdMap[element.id];
        if (element.groupId) element.groupId = groupIdMap[element.groupId];
      }
      for (const animate of slide.animations) {
        animate.elId = elIdMap[animate.elId];
        animate.id = nanoid(10);
      }

      console.log('😧', slide);

      return {
        ...slide,
        id: slideIdMap[slide.id],
      };
    });
    addSlide(newSlides);
    addHistorySnapshot();
  };

  return {
    addElementsFromData,
    addSlidesFromData,
  };
};

export default addSlidesOrElements;
