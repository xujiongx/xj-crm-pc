import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import PCanvas from './modules/PCanvas';
import PTimeLine from './modules/PTimeLine';

const Page = () => {
  const [curIndex, setCurIndex] = useState(0);
  const timeLineRef = useRef<{ play: () => void; timelineState: any }>(null);

  const { slides } = JSON.parse(localStorage.getItem('PPTEditorData') || '{}');

  const handleClick = () => {
    timeLineRef.current?.play();
  };

  const nextScreen = () => {
    setCurIndex((pre) => pre + 1);
    timeLineRef.current?.timelineState.setTime(0);
    setTimeout(() => {
      timeLineRef.current?.play();
    }, 1000);
  };

  useEffect(() => {
    if (curIndex === slides.length - 1) {
      return;
    }

    timeLineRef.current?.timelineState.listener?.on('ended', () => {
      nextScreen();
    });

    return () => {
      timeLineRef.current?.timelineState.listener?.off('ended');
    };
  }, [curIndex, slides]);

  return (
    <div>
      <div className={styles['canvas-wrapper']}>
        <PCanvas curIndex={curIndex} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          zIndex: '999',
        }}
      >
        <PTimeLine ref={timeLineRef} curIndex={curIndex} />
        <Button onClick={() => handleClick()}>播放</Button>
        <Button
          onClick={() => {
            if (curIndex === 0) return;
            setCurIndex((cur) => cur - 1);
          }}
        >
          上
        </Button>
        <Button
          onClick={() => {
            if (curIndex === slides.length - 1) return;
            setCurIndex((cur) => cur + 1);
          }}
        >
          下
        </Button>
      </div>
    </div>
  );
};

export default Page;
