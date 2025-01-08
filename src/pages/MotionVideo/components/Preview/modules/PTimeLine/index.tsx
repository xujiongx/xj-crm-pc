import { Timeline, TimelineState } from '@/components/react-timeline-edit';
import { mockEffect } from '@/pages/MotionVideo/components/PPTEditor/modules/TimeLine/const';
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { formatActions } from './utils';

const PTimeLine = (
  props: { curIndex: any; PPTEditorData: any },
  ref: Ref<unknown> | undefined,
) => {
  const { curIndex, PPTEditorData } = props;
  const timelineState = useRef<TimelineState>(null);
  const [data, setData] = useState([]);

  const { slides: slidesData = [] } = PPTEditorData;
  const currentSlide = slidesData[curIndex];
  const animations = currentSlide?.animations;

  useEffect(() => {
    const elements = currentSlide?.elements || [];

    const rows = formatActions({
      elements,
      animations,
    });

    setData(rows as any);
  }, [currentSlide]);

  // 对外暴露出timelineState
  useImperativeHandle(ref, () => ({
    timelineState: timelineState.current,
    play: () => {
      timelineState.current?.play({ autoEnd: true });
    },
  }));

  useEffect(() => {
    const ref = timelineState.current;
    return () => {
      ref?.pause();
      ref?.setTime(0);
    };
  }, []);

  return (
    <div
      style={{
        display: 'none',
      }}
    >
      <Timeline ref={timelineState} editorData={data} effects={mockEffect} />
    </div>
  );
};

export default forwardRef(PTimeLine);
