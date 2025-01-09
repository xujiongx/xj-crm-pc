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
  console.log('👱rows', rows);
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

export const handleResetElement = (
  elements: PPTElement[],
  animations: PPTAnimation[],
) => {
  elements.forEach((element) => {
    const curElementAnimations = animations.filter(
      (item) => item.elId === element.id,
    );
    const show =
      curElementAnimations[0].type === 'in' &&
      curElementAnimations[0].effect === 'show';
    setElementVisibility(element.id, show);
  });
};
