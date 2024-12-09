import { useKeyPress } from 'ahooks';
import { Button, InputNumber } from 'antd';
import { useEffect, useRef } from 'react';
import { ANIMATION_CLASS_PREFIX } from '../PPTEditor/config';
import Canvas from '../PPTEditor/modules/Canvas';
import videoPlayerControl from '../PPTEditor/modules/Canvas/components/EditableElement/Element/VideoElement/videoControl';
import Timeline from '../PPTEditor/modules/TimeLine';
import { useMainStore, useSlidesStore } from '../PPTEditor/store';
const Page = () => {
  const slidesData = localStorage.getItem('slides');

  const ref = useRef(null);

  useEffect(() => {
    if (slidesData) {
      useSlidesStore.getState().setSlides(JSON.parse(slidesData));
    }
  }, [slidesData]);

  const handleStart = () => {
    ref.current?.onPlay();
  };

  const handleReStart = () => {
    ref.current?.timelineState.setTime(0);
    // ref.current?.timeLineState.setTime
    useSlidesStore.getState().updateSlideIndex(0);
    setTimeout(() => {
      ref.current?.timelineState.play({ autoEnd: true });
    }, 10);
  };

  useEffect(() => {
    const dom = document.querySelector('#viewport-wrapper');
    console.log('👳‍♂️', dom);
    if (dom) {
      dom.style['width'] = '100vw';
      dom.style['height'] = '100vh';
      dom.style['position'] = 'fixed';
      dom.style['top'] = '0';
      dom.style['left'] = '0';
    }
  }, []);

  // 执行元素动画
  const runAnimation = () => {
    return new Promise<void>((resolve) => {
      const turningMode = useSlidesStore.getState().currentSlide().turningMode;
      // const animationName = `${ANIMATION_CLASS_PREFIX}${turningMode}`;
      const animationName = `${ANIMATION_CLASS_PREFIX}${'fadeOutUp'}`;
      const elRef = document.querySelector(`#viewport-wrapper`);
      console.log('👩‍💼', elRef);
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
        resolve();
      };
      elRef.addEventListener('animationend', handleAnimationEnd, {
        once: true,
      });
    });
  };

  const nextScreen = async () => {
    if (
      useSlidesStore.getState().slideIndex ===
      useSlidesStore.getState().slides.length - 1
    ) {
      return;
    }
    await runAnimation();
    console.log('😀', useSlidesStore.getState().slideIndex);

    useSlidesStore
      .getState()
      .updateSlideIndex(useSlidesStore.getState().slideIndex + 1);
    ref.current?.timelineState.setTime(0);
    setTimeout(() => {
      ref.current?.timelineState.play({ autoEnd: true });
    }, 10);
  };

  useEffect(() => {
    ref.current?.timelineState.listener?.on('ended', async () => {
      nextScreen();
    });
  }, []);

  useEffect(() => {
    videoPlayerControl.clean();
    useSlidesStore.getState().updateSlideIndex(0);
    // setTimeout(() => {
    //   handleStart();
    // }, 1000);
  }, []);

  useKeyPress('shift', () => {
    handleStart();
  });

  return (
    <div>
      <div
        style={{
          zIndex: '1000',
        }}
      >
        <Button
          onClick={() => {
            handleStart();
          }}
        >
          开始播放
        </Button>
        <Button
          onClick={() => {
            handleReStart();
          }}
        >
          重新播放
        </Button>
        <InputNumber
          value={1}
          onChange={(v) => {
            useMainStore.getState().setCanvasScale(v);
          }}
        ></InputNumber>
      </div>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: '0',
          left: '0',
          zIndex: '999',
        }}
      >
        <Canvas
          viewportWrapperStyle={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: '999',
          }}
        />
      </div>

      <Timeline
        ref={ref}
        style={{
          display: 'none',
        }}
      />
    </div>
  );
};

export default Page;
