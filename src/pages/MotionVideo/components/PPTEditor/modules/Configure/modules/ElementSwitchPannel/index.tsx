import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { useSlidesStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import { SLIDE_ANIMATIONS } from '@/pages/MotionVideo/config';
import { TurningMode } from '@/pages/MotionVideo/interface';
import { Button, message } from 'antd';
import clsx from 'clsx';
import styles from './index.less';
const ElementSwitchPanel = () => {
  const animations = SLIDE_ANIMATIONS;
  const { addHistorySnapshot } = useHistorySnapshot();
  const slides = useSlidesStore((state) => state.slides);
  const slidesStore = useSlidesStore.getState();
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );
  const currentTurningMode = currentSlide?.turningMode || 'scaleY';

  const updateTurningMode = (mode: TurningMode) => {
    if (mode === currentTurningMode) return;
    useSlidesStore.getState().updateSlide({ turningMode: mode });
    addHistorySnapshot();
  };

  const applyAllSlide = () => {
    const newSlides = slides.map((slide) => {
      return {
        ...slide,
        turningMode: currentSlide?.turningMode,
      };
    });
    slidesStore.setSlides(newSlides);
    message.success('已应用到全部');
    addHistorySnapshot();
  };

  return (
    <div className={styles['slide-animation-panel']}>
      <div className={styles['animation-pool']}>
        {animations.map((item) => (
          <div
            key={item.label}
            className={clsx({
              [styles['animation-item']]: true,
              [styles['active']]: item.value === currentSlide?.turningMode,
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
    </div>
  );
};

export default ElementSwitchPanel;
