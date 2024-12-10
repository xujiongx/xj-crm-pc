import { Timeline, TimelineState } from '@/components/react-timeline-edit';
import { mockEffect } from '@/pages/MotionVideo/PPTEditor/modules/TimeLine/const';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const PTimeLine = (props, ref) => {
  const { curIndex } = props;
  const timelineState = useRef<TimelineState>(null);
  const [data, setData] = useState([]);

  const { slides: slidesData } = JSON.parse(
    localStorage.getItem('PPTEditorData') || '{}',
  );
  const currentSlide = slidesData[curIndex];
  const animations = currentSlide?.animations;

  const formatData = () => {
    const elements = currentSlide.elements;
    const rows = elements.map((item) => {
      const actions = animations
        .filter((animate) => animate.elId === item.id)
        .map((animate) => {
          if (animate.type === 'video') {
            return {
              id: animate.id,
              start: animate.start || 0,
              end: animate.end || 0,
              effectId: 'video',
              data: animate,
            };
          }
          return {
            id: animate.id,
            start: animate.start || 0,
            end: animate.end || 0,
            effectId: 'animate',
            data: animate,
          };
        });

      return {
        ...item,
        id: item.id,
        name: item.type,
        actions,
      };
    });

    setData(rows);
  };

  useEffect(() => {
    formatData();
  }, [curIndex]);

  // 对外暴露出timelineState
  useImperativeHandle(ref, () => ({
    timelineState: timelineState.current,
    play: () => {
      timelineState.current?.play({ autoEnd: true });
    },
  }));

  return (
    <div style={{ display: 'none' }}>
      <Timeline ref={timelineState} editorData={data} effects={mockEffect} />
    </div>
  );
};

export default forwardRef(PTimeLine);
