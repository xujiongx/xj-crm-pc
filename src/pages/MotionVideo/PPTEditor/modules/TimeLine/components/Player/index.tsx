import { TimelineState } from '@/components/react-timeline-edit';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Select, Switch } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { scale, scaleWidth, startLeft } from '../../const';
import styles from './index.less';

const { Option } = Select;
export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];

const TimelinePlayer: FC<{
  timelineState: React.MutableRefObject<TimelineState>;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
}> = ({ timelineState, autoScrollWhenPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [time, setTime] = useState(0);

  const currentSlide = useSlidesStore.getState().currentSlide();
  const elements = currentSlide?.elements;

  // 重置
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();
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

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;
    engine.listener.on('play', () => {
      setIsPlaying(true);
    });
    engine.listener.on('paused', () => {
      setIsPlaying(false);
    });
    engine.listener.on('afterSetTime', ({ time }) => {
      setTime(time);
    });
    engine.listener.on('ended', () => {
      // if (
      //   useSlidesStore.getState().slideIndex ===
      //   useSlidesStore.getState().slides.length - 1
      // ) {
      //   return;
      // }
      // console.log('😀', useSlidesStore.getState().slideIndex);
      // timelineState.current.setTime(0);
      // useSlidesStore
      //   .getState()
      //   .updateSlideIndex(useSlidesStore.getState().slideIndex + 1);
      // setTimeout(() => {
      //   timelineState.current.play({ autoEnd: true });
      // }, 0);

      // setIsEnd(true);
    });
    engine.listener.on('setTimeByTick', ({ time }) => {
      setTime(time);
      const autoScrollFrom = 500;
      const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
      timelineState.current.setScrollLeft(left);
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
    };
  }, []);

  // 开始或暂停
  const handlePlayOrPause = () => {
    if (!timelineState.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      if (isEnd) {
        timelineState.current.setTime(0);
        handleResetElement(elements, currentSlideAnimations);
        setIsEnd(false);
        timelineState.current.play({ autoEnd: true });
      } else {
        timelineState.current.play({ autoEnd: true });
      }

      // if (isEnd) {
      //   timelineState.current.setTime(0);
      //   useSlidesStore
      //     .getState()
      //     .updateSlideIndex(useSlidesStore.getState().slideIndex + 1);
      //   timelineState.current.play({ autoEnd: true });
      //   return;
      // }

      // timelineState.current.play({ autoEnd: true });
    }
  };

  // 设置播放速率
  const handleRateChange = (rate: number) => {
    if (!timelineState.current) return;
    timelineState.current.setPlayRate(rate);
  };

  // 时间展示
  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + '') + '').padStart(2, '0');
    const min = (parseInt(time / 60 + '') + '').padStart(2, '0');
    const second = (parseInt((time % 60) + '') + '').padStart(2, '0');
    return <>{`${min}:${second}.${float.replace('0.', '')}`}</>;
  };

  return (
    <div className={styles['timeline-player']}>
      <div>
        字幕
        <Switch />
      </div>
      <div className={styles['play-control']} onClick={handlePlayOrPause}>
        {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      </div>
      {/* <Button
        onClick={() => {
          timelineState.current?.setTime(0);
          setIsEnd(false);
        }}
      >
        重新开始
      </Button> */}
      <div className={styles['time']}>{timeRender(time)}</div>
      <div className={styles['rate-control']}>
        <Select
          size={'small'}
          defaultValue={1}
          style={{ width: 120 }}
          onChange={handleRateChange}
        >
          {Rates.map((rate) => (
            <Option key={rate} value={rate}>{`${rate.toFixed(1)}倍速`}</Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default TimelinePlayer;
