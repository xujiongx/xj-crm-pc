import { ANIMATION_CLASS_PREFIX } from '@/pages/MotionVideo/PPTEditor/config';
import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { useMainStore, useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';

export const useTileLine = () => {
  const { add } = useHistorySnapshot();
  const handleElementId = useMainStore((state) => state.activeElementId);
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();

  // 执行动画预览
  const runAnimation = (elId: string, effect: string, duration: number) => {
    const elRef = document.querySelector(`#element-${elId}`);
    if (elRef) {
      const animationName = `${ANIMATION_CLASS_PREFIX}${effect}`;
      document.documentElement.style.setProperty(
        '--animate-duration',
        `${duration * 1000}ms`,
      );
      elRef.classList.add(`${ANIMATION_CLASS_PREFIX}animated`, animationName);

      const handleAnimationEnd = () => {
        document.documentElement.style.removeProperty('--animate-duration');
        elRef.classList.remove(
          `${ANIMATION_CLASS_PREFIX}animated`,
          animationName,
        );
      };
      elRef.addEventListener('animationend', handleAnimationEnd, {
        once: true,
      });
    }
  };

  // 修改元素动画
  const updateAnimation = (id: string, data) => {
    const animations = currentSlideAnimations.map((item) => {
      if (item.id === id) return { ...item, ...data };
      return item;
    });
    useSlidesStore.getState().updateSlide({ animations });
    add();

    // const animationItem = currentSlideAnimations.find((item) => item.id === id);

    // if (!animationItem) return;

    // const curAnimationItem = {
    //   ...animationItem,
    //   ...data,
    // };

    // const duration = curAnimationItem.end - curAnimationItem.start;

    // setTimeout(() => {
    //   runAnimation(handleElementId, curAnimationItem.effect, duration);
    // }, 0);
  };

  return {
    updateAnimation,
  };
};
