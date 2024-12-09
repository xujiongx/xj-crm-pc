import { getUrlParams } from '@/utils';
import { useEffect } from 'react';
import useGlobalHotkey from './hooks/useGlobalHotkey';
import styles from './index.less';
import Canvas from './modules/Canvas';
import CanvasTool from './modules/CanvasTool';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import TimeLine from './modules/TimeLine';
import { useMainStore, useSlidesStore } from './store';
import videoPlayerControl from './modules/Canvas/components/EditableElement/Element/VideoElement/videoControl';


const MotionVideoEditor = () => {
  const { type: viewportRatio } = getUrlParams<{ type: string }>();
  useGlobalHotkey();

  useEffect(() => {
    document.oncontextmenu = (e) => e.preventDefault();
  }, []);

  const slidesData = localStorage.getItem('slides');
  const hiddenElementIdList = localStorage.getItem('hiddenElementIdList');

  useEffect(() => {
    if (slidesData) {
      useSlidesStore.getState().setSlides(JSON.parse(slidesData));
    }
    if (hiddenElementIdList) {
      useMainStore
        .getState()
        .setHiddenElementIdList(JSON.parse(hiddenElementIdList));
    }
  }, [slidesData, hiddenElementIdList]);

  useEffect(() => {
    videoPlayerControl.clean();
    useSlidesStore.getState().updateSlideIndex(0);
  }, []);

  useEffect(() => {
    if (viewportRatio === '1') {
      useMainStore.getState().setViewportRatio(9 / 16);
    }
    if (viewportRatio === '2') {
      useMainStore.getState().setViewportRatio(16 / 9);
    }
  }, [viewportRatio]);

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
