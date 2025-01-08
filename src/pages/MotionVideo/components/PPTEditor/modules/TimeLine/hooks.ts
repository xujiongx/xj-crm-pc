import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { useSlidesStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTElement } from '@/pages/MotionVideo/interface';
import useDragElement from '../../hooks/useDragElement';
import useSelectElement from '../Canvas/hooks/useSelectElement';

export const useTimeLine = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();
  const { updateSlide } = useSlidesStore((state) => state);

  // 修改元素动画
  const updateAnimation = (id: string, data: any) => {
    const animations = currentSlideAnimations.map((item) => {
      if (item.id === id) return { ...item, ...data };
      return item;
    });
    updateSlide({ animations });
    addHistorySnapshot();
  };

  return {
    updateAnimation,
  };
};

export const useElement = () => {
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const { drag } = useDragElement(currentSlide?.elements, () => {});

  const { select } = useSelectElement(currentSlide?.elements, drag);

  const handleSelectElement = (e: any, item: PPTElement) => {
    select(e, item, false);
  };

  return {
    handleSelectElement,
  };
};
