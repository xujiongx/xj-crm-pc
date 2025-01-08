import { useCallback } from 'react';
import { useMainStore, useSlidesStore } from '../store';

const useSelectElements = () => {
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );
  const handleElementId = useMainStore((store) => store.activeElementId);
  const setActiveElementIdList = useMainStore(
    (store) => store.setActiveElementIds,
  );

  // 将当前页面全部元素设置为被选择状态
  const selectAllElements = useCallback(() => {
    const unlockedElements = currentSlide.elements.filter(
      (el) => !el.lock && !hiddenElementIdList.includes(el.id),
    );
    const newActiveElementIdList = unlockedElements.map((el) => el.id);
    setActiveElementIdList(newActiveElementIdList);
  }, [currentSlide, hiddenElementIdList, setActiveElementIdList]);

  // 将指定元素设置为被选择状态
  const selectElement = useCallback(
    (id: string) => {
      if (handleElementId === id) return;
      if (hiddenElementIdList.includes(id)) return;

      const lockedElements = currentSlide.elements.filter((el) => el.lock);
      if (lockedElements.some((el) => el.id === id)) return;

      setActiveElementIdList([id]);
    },
    [
      handleElementId,
      hiddenElementIdList,
      currentSlide,
      setActiveElementIdList,
    ],
  );

  return {
    selectAllElements,
    selectElement,
  };
};

export default useSelectElements;
