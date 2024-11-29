import { useKeyPress } from 'ahooks';
import { Button, InputNumber } from 'antd';
import { useEffect, useRef } from 'react';
import Canvas from '../Editor/modules/Canvas';
import Timeline from '../Editor/modules/TimeLine';
import { useMainStore, useSlidesStore } from '../Editor/store';

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

  useEffect(() => {
    ref.current?.timelineState.listener?.on('ended', () => {
      if (
        useSlidesStore.getState().slideIndex ===
        useSlidesStore.getState().slides.length - 1
      ) {
        return;
      }
      console.log('😀', useSlidesStore.getState().slideIndex);

      useSlidesStore
        .getState()
        .updateSlideIndex(useSlidesStore.getState().slideIndex + 1);
      ref.current?.timelineState.setTime(0);
      setTimeout(() => {
        ref.current?.timelineState.play({ autoEnd: true });
      }, 0);
    });
  }, []);

  useEffect(() => {
    useSlidesStore.getState().updateSlideIndex(0);
    setTimeout(() => {
      handleStart();
    }, 1000);
  }, []);

  // useEffect(() => {
  //   handleStart()
  // },[])

  useKeyPress(['shift'], () => {
    handleReStart();
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
