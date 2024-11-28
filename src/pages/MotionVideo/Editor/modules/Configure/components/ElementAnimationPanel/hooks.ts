import { ANIMATION_CLASS_PREFIX } from '@/pages/MotionVideo/Editor/config';
import useHistorySnapshot from '@/pages/MotionVideo/Editor/hooks/useHistorySnapshot';
import { PPTAnimation } from '@/pages/MotionVideo/Editor/interface';
import { useMainStore, useSlidesStore } from '@/pages/MotionVideo/Editor/store';
import { nanoid } from 'nanoid';

export const useElementAnimationPanel = () => {
  const { add } = useHistorySnapshot();
  const handleElementId = useMainStore((state) => state.activeElementId);
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();

  const slidesStore = useSlidesStore.getState();

  const curElementAnimations = currentSlideAnimations.filter(
    (item) => item.elId === handleElementId,
  );

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

  // 删除元素动画
  const deleteAnimation = (id: string) => {
    const animations = currentSlideAnimations.filter((item) => item.id !== id);
    slidesStore.updateSlide({ animations });
    add();
  };
  // 修改元素动画，并执行一次预览
  const updateAnimation = (id: string, data) => {
    const animations = currentSlideAnimations.map((item) => {
      if (item.id === id) return { ...item, ...data };
      return item;
    });
    useSlidesStore.getState().updateSlide({ animations });
    add();

    const animationItem = currentSlideAnimations.find((item) => item.id === id);

    if (!animationItem) return;

    const curAnimationItem = {
      ...animationItem,
      ...data,
    };

    const duration = curAnimationItem.end - curAnimationItem.start;

    setTimeout(() => {
      runAnimation(handleElementId, curAnimationItem.effect, duration);
    }, 0);
  };
  const addAnimation = (data: any) => {
    const animations: PPTAnimation[] = JSON.parse(
      JSON.stringify(currentSlideAnimations),
    );
    animations.push({
      id: nanoid(10),
      elId: handleElementId,
      ...data,
    });
    slidesStore.updateSlide({ animations });
    add();

    setTimeout(() => {
      runAnimation(handleElementId, data.effect, data.end - data.start);
    }, 0);
  };

  const handleAddAnimation = (data) => {
    const animations = currentSlideAnimations.filter(
      (item) => item.elId === handleElementId,
    );
    if (animations.length === 0) {
      addAnimation({
        start: 0,
        end: 1,
        ...data,
      });
    } else {
      const curStart = animations[animations.length - 1].end || 0;
      addAnimation({
        start: curStart,
        end: curStart + 1,
        ...data,
      });
    }
  };

  const manualRunAnimation = (id) => {
    const animationItem = currentSlideAnimations.find((item) => item.id === id);

    if (animationItem) {
      runAnimation(
        handleElementId,
        animationItem.effect,
        animationItem.end - animationItem.start,
      );
    }
  };

  return {
    handleElementId, // 选中元素的id
    curElementAnimations, // 当前元素的动画列表
    deleteAnimation,
    updateAnimation,
    handleAddAnimation,
    manualRunAnimation,
  };
};
