import videoPlayerControl from '@/pages/MotionVideo/elements/Element/VideoElement/videoControl';
import { FoldUpOne, Layers } from '@icon-park/react';
import { useEffect } from 'react';
import Preview from '../Preview';
import useFullscreen from './hooks/useFullscreen';
import useGlobalHotkey from './hooks/useGlobalHotkey';
import styles from './index.less';
import Canvas from './modules/Canvas';
import CanvasTool from './modules/CanvasTool';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import TimeLine from './modules/TimeLine';
import { useMainStore, useSlidesStore, useSnapshotStore } from './store';

const MotionVideoEditor = (props) => {
  const { PPTEditorData, dimensionRatio, videoData } = props;
  const {
    slides,
    setSlides,
    clean: slideClean,
    updateSlideIndex,
    setTheme,
  } = useSlidesStore((state) => state);
  const {
    hiddenElementIdList,
    setHiddenElementIdList,
    setViewportRatio,
    clean,
  } = useMainStore((state) => state);

  const setShowTimeline = useMainStore((store) => store.setShowTimeline);
  const showTimeline = useMainStore((store) => store.showTimeline);

  useGlobalHotkey();

  useEffect(() => {
    document.oncontextmenu = (e) => e.preventDefault();
  }, []);

  const initHistorySnapshot = useSnapshotStore((store) => store.init);

  useEffect(() => {
    if (!PPTEditorData) return;
    const { slides: slidesData, hiddenElementIdList, theme } = PPTEditorData;
    if (slidesData) {
      setSlides(slidesData);
      setTheme(theme);
      initHistorySnapshot(slidesData);
    }
    if (hiddenElementIdList) {
      setHiddenElementIdList(hiddenElementIdList);
    }
  }, [PPTEditorData]);

  useEffect(() => {
    useMainStore.getState().setAvailableFonts();
    return () => {
      slideClean();
      clean();
    };
  }, []);

  useEffect(() => {
    if (!PPTEditorData) return;
    videoPlayerControl.clean();
    updateSlideIndex(0);
  }, [PPTEditorData]);

  useEffect(() => {
    if (dimensionRatio === '1') {
      setViewportRatio(9 / 16);
    }
    if (dimensionRatio === '2') {
      setViewportRatio(16 / 9);
    }
  }, [dimensionRatio]);

  const PPTData = {
    slides,
    hiddenElementIdList,
  };

  const setIsEditorHsaChange = useMainStore(
    (state) => state.setIsEditorHsaChange,
  );

  useEffect(() => {
    setIsEditorHsaChange(
      !(JSON.stringify(PPTEditorData) === JSON.stringify(PPTData)),
    );
  }, [JSON.stringify(PPTData)]);

  const setVideoData = useMainStore((state) => state.setVideoData);

  useEffect(() => {
    setVideoData(videoData);
  }, [videoData]);

  const isEditorHsaChange = useMainStore((state) => state.isEditorHsaChange);

  const { screening } = useFullscreen();
  if (screening) {
    return (
      <Preview
        PPTEditorData={PPTData}
        dimensionRatio={dimensionRatio}
        toVideoStartPage={1}
      />
    );
  }

  return (
    <div className={styles.layout}>
      <Header
        className={styles['layout-header']}
        isEditorHsaChange={isEditorHsaChange}
      />
      <div className={styles['layout-content']}>
        <Material className={styles['layout-content-left']} />
        <div className={styles['layout-content-center']}>
          <CanvasTool className={styles['center-top']} />
          <Canvas />
          {showTimeline ? (
            <TimeLine />
          ) : (
            <div
              onClick={() => setShowTimeline(true)}
              className={styles['timeline-open']}
            >
              <Layers style={{ marginRight: '4px' }} />
              图层/时间轴
              <FoldUpOne style={{ marginLeft: '4px' }} />
            </div>
          )}
        </div>
        <Configure className={styles['layout-content-right']} />
      </div>
    </div>
  );
};

export default MotionVideoEditor;
