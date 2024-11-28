import { Timeline, TimelineState } from '@/components/react-timeline-edit';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useMainStore, useSlidesStore } from '../../store';
import ElementList from './components/ElementList';
import TimelinePlayer from './components/Player';
import { useTileLine } from './hooks';
import './index.less';
import styles from './index.less';
import { mockData, mockEffect, scale, scaleWidth, startLeft } from './mock';
const defaultEditorData = cloneDeep(mockData);

const height = 250;

const TimelineEditor = () => {
  const [data, setData] = useState([]);
  const domRef = useRef<HTMLDivElement>();
  const timelineState = useRef<TimelineState>();

  const currentSlide = useSlidesStore.getState().currentSlide();
  const animations = useSlidesStore.getState().currentSlideAnimations();
  const handleElementIds = useMainStore((state) => state.activeElementIds);

  const { updateAnimation } = useTileLine();

  useEffect(() => {
    if (!currentSlide?.elements.length) {
      setData([]);
      return;
    }
    const elements = currentSlide.elements;
    const rows = elements.map((item, index) => {
      const actions = animations
        .filter((animate) => animate.elId === item.id)
        .map((animate, index) => ({
          id: animate.id,
          start: animate.start || 0,
          end: animate.end || 0,
          // start: index,
          // end: index + animate.duration / 1000,
          effectId: 'effect0',
          data: animate,
        }));

      return {
        ...item,
        id: item.id,
        name: item.type,
        selected: handleElementIds.includes(item.id),
        actions,
      };
    });

    console.log('🤗rows', rows);
    setData(rows);
  }, [
    JSON.stringify(currentSlide),
    JSON.stringify(animations),
    handleElementIds,
  ]);

  console.log('🏃‍♀️', animations, currentSlide, data);
  return (
    <div>
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={false}
      />
      <div className={styles['timeline-editor-container']}>
        <ElementList
          listStyle={{
            height: `${height}px`,
          }}
          domRef={domRef}
          timelineState={timelineState}
          data={data}
        />
        <Timeline
          style={{
            height: `${height + 32}px`,
          }}
          scale={scale}
          scaleWidth={scaleWidth}
          startLeft={startLeft}
          autoScroll={true}
          gridSnap={true}
          dragLine={true}
          ref={timelineState}
          onChange={(value) => {}}
          editorData={data}
          effects={mockEffect}
          onScroll={({ scrollTop }) => {
            if (domRef.current) {
              domRef.current.scrollTop = scrollTop;
              timelineState.current?.setScrollTop(scrollTop);
            }
          }}
          onActionMoveEnd={(params) => {
            const data = params.action.data;
            console.log('💁‍♂️onActionMoving', params, data);
            updateAnimation(data.id, {
              data,
              start: params.action.start,
              end: params.action.end,
            });
          }}
        />
      </div>
    </div>
  );
};

export default TimelineEditor;
