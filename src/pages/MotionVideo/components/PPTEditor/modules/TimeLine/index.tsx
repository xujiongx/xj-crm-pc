import { Timeline, TimelineState } from '@/components/react-timeline-edit';
import emitter, { EmitterEvents } from '@/pages/MotionVideo/utils/emitter';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useMainStore, useSlidesStore } from '../../store';
import ContextMenu from '../Canvas/components/ContextMenu';
import { ToolbarStates } from '../Configure/enum';
import ActionRender from './components/ActionRender';
import ElementList from './components/ElementList';
import TimelinePlayer from './components/Player';
import { mockEffect, scaleWidth, startLeft } from './const';
import {
  useElement,
  useMenu,
  useTimeLine,
  useTimeLineHandleClick,
} from './hooks';
import './index.less';
import styles from './index.less';
import { formatActions, handleSetElementVisibility } from './utils';

const height = 250;

const TimelineEditor = forwardRef((props, ref) => {
  const domRef = useRef<HTMLDivElement>();
  const timelineState = useRef<TimelineState>(null);
  const viewportwrapperRef = useRef<HTMLDivElement>(null);

  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );
  const handleElementIds = useMainStore((state) => state.activeElementIds);
  const activeActionId = useMainStore((state) => state.activeActionId);
  const { updateAnimation } = useTimeLine();
  const { handleSelectElement } = useElement();

  const setActiveActionId = useMainStore((state) => state.setActiveActionId);
  const setActiveConfigTab = useMainStore((store) => store.setActiveConfigTab);
  const [data, setData] = useState([]);
  const [scale, setScale] = useState(1);

  const [scrollTop, setScrollTop] = useState(0);

  const { menuItems, contextMenuClickFn } = useMenu();

  useEffect(() => {
    if (!currentSlide?.elements.length) {
      setData([]);
      return;
    }
    const rows = formatActions({
      elements: currentSlide.elements,
      animations: currentSlide.animations || [],
      selectedIds: handleElementIds,
    });
    setData(rows);
  }, [JSON.stringify(currentSlide), handleElementIds]);

  // 对外暴露出timelineState
  useImperativeHandle(ref, () => ({
    timelineState: timelineState.current,
    onPlay: () => {
      timelineState.current?.play({ autoEnd: true });
    },
  }));

  useEffect(() => {
    // 添加全局的时间设置事件，供外部组件使用
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

  const { handleClickBlankArea } = useTimeLineHandleClick();

  return (
    <div className={styles['timeline-wrapper']}>
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={false}
        scale={scale}
        handleScaleChange={(v) => {
          setScale(v);
          timelineState.current?.setScrollLeft(0);
        }}
      />
      <div
        className={styles['timeline-editor-container']}
        ref={viewportwrapperRef}
        onMouseDown={(e) => handleClickBlankArea(e)}
      >
        <ElementList
          listStyle={{
            height: `${height}px`,
          }}
          domRef={domRef}
          timelineState={timelineState}
          data={data}
          scrollTop={scrollTop}
          setScrollTop={setScrollTop}
        />
        <Timeline
          ref={timelineState}
          style={{
            height: `${height + 32}px`,
          }}
          scale={scale}
          scaleWidth={scaleWidth}
          startLeft={startLeft}
          autoScroll={true}
          gridSnap={true}
          dragLine={true}
          onClickTimeArea={(time) => {
            // 还原状态
            handleSetElementVisibility(
              currentSlide.elements,
              currentSlide.animations || [],
              time,
            );
            return true;
          }}
          onContextMenuAction={(e, { action, time }) => {
            if (action.lock) return;
            const curTime = timelineState.current?.getTime() || 0;
            if (curTime <= action.start || curTime >= action.end) {
              timelineState.current?.setTime(action.start);
            }
            // 还原状态
            handleSetElementVisibility(
              currentSlide.elements,
              currentSlide.animations || [],
              time,
            );
            setActiveActionId(action.id);
            setTimeout(() => {
              setActiveConfigTab(ToolbarStates.EL_ANIMATION);
            }, 10);
          }}
          onClickRow={(e, { row }) => {
            handleSelectElement(e, row);
          }}
          onChange={() => {
            return false;
          }}
          onClickAction={(e, { action, time }) => {
            if (action.lock) return;
            const curTime = timelineState.current?.getTime() || 0;
            if (curTime <= action.start || curTime >= action.end) {
              timelineState.current?.setTime(action.start);
            }
            // 还原状态
            handleSetElementVisibility(
              currentSlide.elements,
              currentSlide.animations || [],
              time,
            );
            setActiveActionId(action.id);
            setTimeout(() => {
              setActiveConfigTab(ToolbarStates.EL_ANIMATION);
            }, 10);
          }}
          editorData={data}
          effects={mockEffect}
          onScroll={({ scrollTop }) => {
            setScrollTop(scrollTop);
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
            <ActionRender
              action={action}
              row={row}
              activeAction={activeActionId}
            />
          )}
        />
        <ContextMenu
          menuItems={menuItems}
          targetEl={viewportwrapperRef.current as HTMLDivElement}
          contextMenuClickFn={contextMenuClickFn}
        ></ContextMenu>
      </div>
    </div>
  );
});

export default TimelineEditor;
