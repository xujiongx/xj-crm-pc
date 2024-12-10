import { Timeline, TimelineState } from '@/components/react-timeline-edit';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useMainStore, useSlidesStore } from '../../store';
import emitter, { EmitterEvents } from '../../utils/emitter';
import ActionRender from './components/ActionRender';
import ElementList from './components/ElementList';
import TimelinePlayer from './components/Player';
import { mockEffect, scaleWidth, startLeft } from './const';
import { useElement, useTileLine } from './hooks';
import './index.less';
import styles from './index.less';

const height = 250;

const TimelineEditor = forwardRef((props, ref) => {
  const { style } = props;
  const [data, setData] = useState([]);
  const domRef = useRef<HTMLDivElement>();
  const timelineState = useRef<TimelineState>(null);

  const currentSlide = useSlidesStore.getState().currentSlide();
  const animations = useSlidesStore.getState().currentSlideAnimations();
  const handleElementIds = useMainStore((state) => state.activeElementIds);

  const { updateAnimation } = useTileLine();

  const { handleSelectElement } = useElement();

  useEffect(() => {
    if (!currentSlide?.elements.length) {
      setData([]);
      return;
    }
    const elements = currentSlide.elements;
    const rows = elements.map((item, index) => {
      const actions = animations
        .filter((animate) => animate.elId === item.id)
        .map((animate, index) => {
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
        selected: handleElementIds.includes(item.id),
        actions,
      };
    });

    setData(rows);
  }, [
    JSON.stringify(currentSlide?.elements),
    JSON.stringify(animations),
    handleElementIds,
  ]);

  // 对外暴露出timelineState
  useImperativeHandle(ref, () => ({
    timelineState: timelineState.current,
    onPlay: () => {
      timelineState.current?.play({ autoEnd: true });
    },
  }));

  useEffect(() => {
    emitter.on(EmitterEvents.SET_TIMELINE_TIME, (time) => {
      if (timelineState.current) {
        timelineState.current.setTime(time);
        timelineState.current.setScrollLeft(time);
      }
    });

    return () => {
      emitter.off(EmitterEvents.SET_TIMELINE_TIME);
    };
  }, []);

  const [scale, setScale] = useState(1);

  return (
    <div style={{ ...style }}>
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={false}
        scale={scale}
        handleScaleChange={(v) => {
          setScale(v);
        }}
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
          onClickRow={(e, { row, time }) => {
            console.log('👳‍♀️', row, time);
            // // 设置时间
            // emitter.emit(EmitterEvents.SET_TIMELINE_TIME, time);

            // 选择行
            handleSelectElement(e, row);
          }}
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
            updateAnimation(data.id, {
              data,
              start: params.action.start,
              end: params.action.end,
            });
          }}
          onActionResizeEnd={(params) => {
            const data = params.action.data;
            updateAnimation(data.id, {
              data,
              start: params.action.start,
              end: params.action.end,
            });
          }}
          getActionRender={(action, row) => (
            <ActionRender action={action} row={row} />
          )}
        />
      </div>
    </div>
  );
});

export default TimelineEditor;
