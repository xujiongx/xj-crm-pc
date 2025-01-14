import { ANIMATION_CLASS_PREFIX } from '@/pages/MotionVideo/config';
import { PPTAnimation, PPTElement } from '@/pages/MotionVideo/interface';

export const formatActions = (data: {
  elements: PPTElement[];
  animations: PPTAnimation[];
  selectedIds?: string[];
}) => {
  const { elements, animations, selectedIds = [] } = data;
  const rows = elements.map((item: PPTElement) => {
    const actions = animations
      .filter((animate: PPTAnimation) => animate.elId === item.id)
      .map((animate: PPTAnimation) => {
        const result = {
          id: animate.id,
          start: animate.start || 0,
          end: animate.end || 0,
          effectId: 'animate',
          data: animate,
          movable: !item.lock,
          flexible: !item.lock,
          lock: item.lock,
        };

        if (animate.type === 'video') {
          result.effectId = 'video';
        }

        if (animate.type === 'audio') {
          result.effectId = 'audio';
          result.data.volume = item.volume;
          result.data.fadeInDuration = item.fadeInDuration;
          result.data.fadeOutDuration = item.fadeOutDuration;
        }
        if (
          animate.type === 'in' ||
          animate.type === 'out' ||
          animate.type === 'attention'
        ) {
          result.effectId = 'animate';
        }
        return result;
      });

    return {
      ...item,
      id: item.id,
      name: item.type,
      selected: selectedIds.includes(item.id),
      actions,
      lock: item.lock,
    };
  });
  return rows;
};

export const setElementVisibility = (id: string, show: boolean) => {
  const elRef = document.querySelector(
    `#element-${id} [class^=editable-element-]`,
  ) as HTMLElement;
  if (elRef) {
    elRef.style.visibility = show ? 'visible' : 'hidden';
  }
};

// 执行动画预览
export const runAnimation = (
  elId: string,
  effect: string,
  duration: number,
  type?: any,
) => {
  const elRef = document.querySelector(
    `#element-${elId} [class^=editable-element-]`,
  ) as HTMLElement;
  if (elRef) {
    const animationName = `${ANIMATION_CLASS_PREFIX}${effect}`;

    // 移除原有的动画类和相关样式
    elRef.style.removeProperty('--animate-duration');
    elRef.classList.remove(`${ANIMATION_CLASS_PREFIX}animated`, animationName);
    // 使用 setTimeout 延迟添加新的动画类，确保上一个动画结束
    setTimeout(() => {
      elRef.style.setProperty(
        '--animate-duration',
        `${duration * 1000 - 100}ms`,
      );
      setElementVisibility(elId, true);
      elRef.classList.add(`${ANIMATION_CLASS_PREFIX}animated`, animationName);
    }, 0);

    const handleAnimationEnd = () => {
      elRef.style.removeProperty('--animate-duration');
      elRef.classList.remove(
        `${ANIMATION_CLASS_PREFIX}animated`,
        animationName,
      );
      if (type === 'out') {
        setElementVisibility(elId, false);
      }
    };
    elRef.addEventListener('animationend', handleAnimationEnd, {
      once: true,
    });
  }
};

export const handleSetElementVisibility = (
  elements: PPTElement[],
  animations: PPTAnimation[],
  time: number,
) => {
  const resetElement = (element: PPTElement) => {
    const curElementAnimations = animations.filter(
      (item) => item.elId === element.id,
    );

    const enterAction = curElementAnimations.find(
      (item) => item.type === 'in' && item.effect !== 'show',
    );

    const outAction = curElementAnimations.find((item) => item.type === 'out');

    setElementVisibility(element.id, true);

    if (enterAction && time <= enterAction.start) {
      setElementVisibility(element.id, false);
    }
    if (outAction && time >= outAction.end) {
      setElementVisibility(element.id, false);
    }
  };

  elements.forEach((element) => {
    resetElement(element);
  });
};
