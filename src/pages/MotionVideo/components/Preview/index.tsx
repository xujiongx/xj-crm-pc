import { enterFullscreen } from '@/pages/MotionVideo/utils/fullscreen';
import { useKeyPress } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import PCanvas from './modules/PCanvas';
import PTimeLine from './modules/PTimeLine';

const handleResetElement = (elements, currentSlideAnimations) => {
  elements.forEach((element) => {
    const curElementAnimations = currentSlideAnimations.filter(
      (item) => item.elId === element.id,
    );
    const show =
      curElementAnimations[0].type === 'in' &&
      curElementAnimations[0].effect === 'show';

    const elRef = document.querySelector(`#element-${element.id}`);
    if (elRef) {
      elRef.style.visibility = show ? 'visible' : 'hidden';
    }
  });
};

const Preview = (props) => {
  const {
    PPTEditorData,
    dimensionRatio,
    toVideoStartPage = 1,
    toVideoEndPage = 0,
  } = props;
  const [curIndex, setCurIndex] = useState(0);
  const timeLineRef = useRef<{ play: () => void; timelineState: any }>(null);

  const { slides } = PPTEditorData;

  const [status, setStatus] = useState('wait');

  useEffect(() => {
    setCurIndex(toVideoStartPage - 1);
  }, [toVideoStartPage]);

  const handleClick = () => {
    timeLineRef.current?.play();
    setStatus('playing');
  };

  const nextScreen = () => {
    timeLineRef.current?.timelineState.setTime(0);
    handleResetElement(slides[curIndex].elements, slides[curIndex].animations);
    setCurIndex((pre) => pre + 1);
  };

  useEffect(() => {
    if (curIndex > toVideoStartPage - 1) {
      setTimeout(() => {
        timeLineRef.current?.play();
      }, 1);
    }
  }, [curIndex, timeLineRef.current]);

  useEffect(() => {
    timeLineRef.current?.timelineState.listener?.on('ended', () => {
      if (curIndex + 1 === toVideoEndPage || curIndex === slides.length - 1) {
        setStatus('end');
        return;
      }
      nextScreen();
    });

    return () => {
      timeLineRef.current?.timelineState.listener?.off('ended');
    };
  }, [curIndex, slides, toVideoEndPage]);

  const handleEnterFullscreen = () => {
    enterFullscreen();
  };

  useKeyPress(['space'], () => {
    handleClick();
  });

  return (
    <div className={styles['timeline-wrapper']}>
      <div className={styles['canvas-wrapper']}>
        <PCanvas
          curIndex={curIndex}
          PPTEditorData={PPTEditorData}
          dimensionRatio={dimensionRatio}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: '999',
        }}
      >
        <PTimeLine
          ref={timeLineRef}
          curIndex={curIndex}
          PPTEditorData={PPTEditorData}
        />
        {/* <Button id="play" onClick={() => handleClick()}>
          播放
        </Button>
        <div id="status">{status}</div>
        <Button id="fullscreen" onClick={() => handleEnterFullscreen()}>
          全屏
        </Button> */}
      </div>
    </div>
  );
};

export default Preview;
