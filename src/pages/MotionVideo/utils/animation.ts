import { ANIMATION_CLASS_PREFIX } from '../config';

// 执行动画预览
export const runAnimation = (
  elId: string,
  effect: string,
  duration: number,
) => {
  const elRef = document.querySelector(
    `#element-${elId} [class^=editable-element-]`,
  ) as HTMLElement;
  if (elRef) {
    const animationName = `${ANIMATION_CLASS_PREFIX}${effect}`;
    elRef.style.setProperty('--animate-duration', `${duration * 1000}ms`);
    elRef.classList.add(`${ANIMATION_CLASS_PREFIX}animated`, animationName);

    const handleAnimationEnd = () => {
      elRef.style.removeProperty('--animate-duration');
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
