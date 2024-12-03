import {
  ANIMATION_CLASS_PREFIX,
  SLIDE_ANIMATIONS,
} from '@/pages/MotionVideo/PPTEditor/config';
import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { TurningMode } from '@/pages/MotionVideo/PPTEditor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { Button } from 'antd';
import clsx from 'clsx';
import styles from './index.less';
const ElementPositionPanel = () => {
  const animations = SLIDE_ANIMATIONS;
  const { add } = useHistorySnapshot();
  const handleRunAnimation = () => {
    const turningMode = useSlidesStore.getState().currentSlide().turningMode;
    // const animationName = `${ANIMATION_CLASS_PREFIX}${turningMode}`;
    const animationName = `${ANIMATION_CLASS_PREFIX}${'fadeOutDown'}`;
    const elRef = document.querySelector(`#viewport-wrapper`);
    if (!elRef) return;
    // 执行动画
    elRef.style.setProperty('--animate-duration', `${1000}ms`);
    elRef.classList.add(animationName, `${ANIMATION_CLASS_PREFIX}animated`);

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
  };

  const currentTurningMode =
    useSlidesStore((state) => state.currentSlide().turningMode) || 'scaleY';

  const updateTurningMode = (mode: TurningMode) => {
    if (mode === currentTurningMode) return;
    useSlidesStore.getState().updateSlide({ turningMode: mode });
    add();
  };
  const currentSlide = useSlidesStore((state) => state.currentSlide);

  const applyAllSlide = () => {};

  return (
    <div className={styles['slide-animation-panel']}>
      <div className={styles['animation-pool']}>
        {animations.map((item) => (
          <div
            key={item.label}
            className={clsx({
              [styles['animation-item']]: true,
              [styles['active']]: item.value === currentSlide().turningMode,
            })}
            onClick={() => updateTurningMode(item.value)}
          >
            <div
              className={clsx({
                [styles['animation-block']]: true,
                [styles[item.value]]: true,
              })}
            ></div>
            <div className={styles['animation-text']}>{item.label}</div>
          </div>
        ))}
        <Button
          style={{ width: '100%', marginTop: '20px' }}
          onClick={() => applyAllSlide()}
        >
          应用到全部
        </Button>
      </div>
      <Button onClick={() => handleRunAnimation()}>转场动画</Button>
    </div>
  );
};

export default ElementPositionPanel;
