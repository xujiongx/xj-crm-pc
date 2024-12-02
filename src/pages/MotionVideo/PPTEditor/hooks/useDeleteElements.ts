import { PPTElement } from '../interface';
import useMainStore from '../store/main';
import useSlidesStore from '../store/slides';
import useSnapshotStore from '../store/snapshot';

export default () => {
  const activeElementIdList = useMainStore((store) => store.activeElementIds);
  const currentSlide = useSlidesStore((store) => store.currentSlide);
  const { add } = useSnapshotStore();

  // 删除全部选中元素
  const deleteElement = () => {
    if (!activeElementIdList.length) return;

    let newElementList: PPTElement[] = [];
    newElementList = currentSlide().elements.filter(
      (el) => !activeElementIdList.includes(el.id),
    );

    useMainStore.getState().setActiveElementIds([]);
    useSlidesStore.getState().updateSlide({ elements: newElementList });
    add();
  };

  // 删除内面内全部元素(无论是否选中)
  const deleteAllElements = () => {
    if (!currentSlide().elements.length) return;
    useMainStore.getState().setActiveElementIds([]);
    useSlidesStore.getState().updateSlide({ elements: [] });
    add();
  };

  return {
    deleteElement,
    deleteAllElements,
  };
};
