import { useEffect } from 'react';
import useGlobalHotkey from './hooks/useGlobalHotkey';
import styles from './index.less';
import Canvas from './modules/Canvas';
import CanvasTool from './modules/CanvasTool';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import TimeLine from './modules/TimeLine';
import { useSlidesStore } from './store';

const MotionVideoEditor = () => {
  useGlobalHotkey();

  useEffect(() => {
    document.oncontextmenu = (e) => e.preventDefault();
  }, []);

  const slidesData = localStorage.getItem('slides');

  useEffect(() => {
    if (slidesData) {
      useSlidesStore.getState().setSlides(JSON.parse(slidesData));
    }
  }, [slidesData]);

  useEffect(() => {
    useSlidesStore.getState().updateSlideIndex(0);
  }, []);

  return (
    <div className={styles.layout}>
      <Header className={styles['layout-header']} />
      <div className={styles['layout-content']}>
        <Material className={styles['layout-content-left']} />
        <div className={styles['layout-content-center']}>
          <CanvasTool className={styles['center-top']} />
          <Canvas />
          <TimeLine />
        </div>
        <Configure className={styles['layout-content-right']} />
      </div>
    </div>
  );
};

export default MotionVideoEditor;
