import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import useDragElement from '../../hooks/useDragElement';
import useSelectElement from '../../hooks/useSelectElement';

export const useTileLine = () => {
  const { add } = useHistorySnapshot();
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();

  // 修改元素动画
  const updateAnimation = (id: string, data) => {
    const animations = currentSlideAnimations.map((item) => {
      if (item.id === id) return { ...item, ...data };
      return item;
    });
    useSlidesStore.getState().updateSlide({ animations });
    add();
  };

  return {
    updateAnimation,
  };
};

export const useElement = () => {
  const currentSlide = useSlidesStore((state) => state.currentSlide);

  const { drag } = useDragElement(currentSlide()?.elements);

  const { select } = useSelectElement(currentSlide()?.elements, drag);

  const handleSelectElement = (e, item) => {
    console.log('😪', e, item);
    select(e, item, false);
  };

  return {
    handleSelectElement,
  };
};
