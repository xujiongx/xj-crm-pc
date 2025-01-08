import { PPTElement } from '@/pages/MotionVideo/interface';
import { useMainStore, useSlidesStore } from '../store';
import useHistorySnapshot from './useHistorySnapshot';

export default () => {
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const setHiddenElementIdList = useMainStore(
    (store) => store.setHiddenElementIdList,
  );
  const setActiveElementIds = useMainStore(
    (store) => store.setActiveElementIds,
  );

  const elements = currentSlide?.elements;

  const activeElementIdList = useMainStore.getState().activeElementIds;
  const hiddenElementIdList = useMainStore.getState().hiddenElementIdList;

  const { addHistorySnapshot } = useHistorySnapshot();

  const toggleHideElement = (element: PPTElement | null) => {
    if (!element) return;
    console.log('🗣', element);
    const groupMembersId: string[] = [];

    if (element.groupId) {
      elements.forEach((el: PPTElement) => {
        if (el.groupId === element.groupId) groupMembersId.push(el.id);
      });
    } else {
      groupMembersId.push(element.id);
    }

    if (hiddenElementIdList.includes(element.id)) {
      setHiddenElementIdList(
        hiddenElementIdList.filter((item) => !groupMembersId.includes(item)),
      );
    } else {
      setHiddenElementIdList([...hiddenElementIdList, ...groupMembersId]);
    }

    setActiveElementIds(groupMembersId);
    addHistorySnapshot();
  };

  const showAllElements = () => {
    const currentSlideElIdList = currentSlide.elements.map((item) => item.id);
    const needHiddenElementIdList = hiddenElementIdList.filter(
      (item) => !currentSlideElIdList.includes(item),
    );
    setHiddenElementIdList(needHiddenElementIdList);
  };
  const hideAllElements = () => {
    const currentSlideElIdList = currentSlide.elements.map((item) => item.id);
    setHiddenElementIdList([...hiddenElementIdList, ...currentSlideElIdList]);
    if (activeElementIdList.length) setActiveElementIds([]);
  };

  return {
    toggleHideElement,
    showAllElements,
    hideAllElements,
  };
};
