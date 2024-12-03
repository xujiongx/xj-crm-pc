import { useMainStore, useSlidesStore } from '../store';

export default () => {
  const mainStore = useMainStore.getState();
  const currentSlide = useSlidesStore.getState().currentSlide();

  const activeElementIdList = useMainStore.getState().activeElementIds;
  const hiddenElementIdList = useMainStore.getState().hiddenElementIdList;

  const toggleHideElement = (id: string) => {
    if (hiddenElementIdList.includes(id)) {
      mainStore.setHiddenElementIdList(
        hiddenElementIdList.filter((item) => item !== id),
      );
    } else mainStore.setHiddenElementIdList([...hiddenElementIdList, id]);

    if (activeElementIdList.includes(id)) mainStore.setActiveElementIds([]);
  };

  const showAllElements = () => {
    const currentSlideElIdList = currentSlide.elements.map((item) => item.id);
    const needHiddenElementIdList = hiddenElementIdList.filter(
      (item) => !currentSlideElIdList.includes(item),
    );
    mainStore.setHiddenElementIdList(needHiddenElementIdList);
  };
  const hideAllElements = () => {
    const currentSlideElIdList = currentSlide.elements.map((item) => item.id);
    mainStore.setHiddenElementIdList([
      ...hiddenElementIdList,
      ...currentSlideElIdList,
    ]);
    if (activeElementIdList.length) mainStore.setActiveElementIds([]);
  };

  return {
    toggleHideElement,
    showAllElements,
    hideAllElements,
  };
};
