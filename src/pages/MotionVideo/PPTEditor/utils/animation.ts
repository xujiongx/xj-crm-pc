import { ANIMATION_CLASS_PREFIX } from '../config';

// 执行动画预览
export const runAnimation = (
  elId: string,
  effect: string,
  duration: number,
) => {
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
