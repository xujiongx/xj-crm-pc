import { PPTElement } from '@/pages/MotionVideo/interface';
import { useMainStore, useSlidesStore } from '../store';
import useHistorySnapshot from './useHistorySnapshot';

export default () => {
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const setActiveElementIds = useMainStore(
    (store) => store.setActiveElementIds,
  );
  const elements = useSlidesStore((store) => store.currentSlide()?.elements);
  const updateSlide = useSlidesStore((store) => store.updateSlide);
  const { addHistorySnapshot } = useHistorySnapshot();

  // 锁定选中的元素,并清空选中元素状态
  const lockElement = (item?: PPTElement | null) => {
    const groupMembersId: string[] = [];
    if (item) {
      if (item.groupId) {
        elements.forEach((el: PPTElement) => {
          if (el.groupId === item.groupId) groupMembersId.push(el.id);
        });
      } else {
        groupMembersId.push(item.id);
      }
    }

    const curActiveElementIds = item ? groupMembersId : activeElementIds;
    const newElementList: PPTElement[] = elements;

    for (const element of newElementList) {
      if (curActiveElementIds.includes(element.id)) element.lock = true;
    }

    updateSlide({ elements: newElementList });
    setActiveElementIds([]);
    addHistorySnapshot();
  };

  /**
   * 解除元素的锁定状态,并将其设置为当前选择元素
   * @param handleElement 需要解锁的元素
   */
  const unlockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = elements;

    if (handleElement.groupId) {
      const groupElementIdList = [];
      for (const element of newElementList) {
        if (element.groupId === handleElement.groupId) {
          element.lock = false;
          groupElementIdList.push(element.id);
        }
      }
      updateSlide({ elements: newElementList });
      setActiveElementIds(groupElementIdList);
    } else {
      for (const element of newElementList) {
        if (element.id === handleElement.id) {
          element.lock = false;
          break;
        }
      }
      updateSlide({ elements: newElementList });
      setActiveElementIds([handleElement.id]);
    }
    addHistorySnapshot();
  };

  return {
    lockElement,
    unlockElement,
  };
};
