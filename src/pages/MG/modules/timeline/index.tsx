import { uid } from '@aicc/shared/es';
import { Timeline, TimelineState } from '@xzdarcy/react-timeline-editor';
import { Button, Switch } from 'antd';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import { useRef, useState } from 'react';
import useTimelineStore from '../../store';
import {
  CustomRender0,
  CustomRender1,
  CustomRender2,
  CustomRender3,
} from './custom';
import ImageRender from './imageRender';
import './index.less';
import {
  CustomTimelineAction,
  CusTomTimelineRow,
  mockData,
  mockEffect,
  scale,
  scaleWidth,
  startLeft,
} from './mock';
import TimelinePlayer from './player';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const timelineState = useRef<TimelineState>();
  const playerPanel = useRef<HTMLDivElement>();
  const autoScrollWhenPlay = useRef<boolean>(true);
  const elements = useTimelineStore((state) => state.elements);

  const handleSave = () => {};
  const handleAdd = () => {
    setData((prev) => {
      const newData = cloneDeep(prev);
      const newRow = {
        id: uid(),
        actions: [
          {
            id: uid(),
            start: 0,
            end: 2,
            effectId: 'effect2',
            data: {
              id: uid(),
              src: '',
              text: '我是文本',
              name: '我是文本',
              type: 'text',
            },
          },
          {
            id: uid(),
            start: 5,
            end: 10,
            effectId: 'effect3',
            data: {
              id: uid(),
              src: require('@/assets/designer/card.png'),
              text: '我是图片',
              name: '图片',
              type: 'image',
            },
          },
          {
            id: uid(),
            start: 10,
            end: 16,
            effectId: 'effect1',
            data: {
              src: '/zdarcy/lottie/lottie1/data.json',
              name: '点赞',
            },
          },
        ],
      };
      newData.push(newRow);
      return newData;
    });
  };

  return (
    <div className="timeline-editor-engine">
      <div className="player-config">
        <Switch
          checkedChildren="开启运行时自动滚动"
          unCheckedChildren="禁用运行时自动滚动"
          defaultChecked={autoScrollWhenPlay.current}
          onChange={(e) => (autoScrollWhenPlay.current = e)}
          style={{ marginBottom: 20 }}
        />
      </div>
      <Button
        onClick={() => {
          handleSave();
        }}
      >
        保存
      </Button>
      <Button
        onClick={() => {
          handleAdd();
        }}
      >
        新增
      </Button>
      <div
        className="player-panel"
        id="player-ground-1"
        ref={playerPanel}
      ></div>
      <div>
        {elements.map((item) => (
          <div key={item.id}>
            {item.type === 'text' && (
              <div
                className={classNames({
                  ['animate__animated']: item.visible,
                  ['animate__bounce']: item.visible,
                })}
                style={{
                  visibility: item.visible ? 'visible' : 'hidden',
                  animationPlayState: item.progress ? 'running' : 'paused',
                  animationDuration: `${item.duration}s`,
                }}
              >
                {item.name}
              </div>
            )}
            {item.type === 'image' && <ImageRender item={item} />}
          </div>
        ))}
      </div>
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />
      <Timeline
        onCursorDrag={(time) => {}}
        onClickAction={(e, params) => {}}
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        autoScroll={true}
        gridSnap={true}
        dragLine={true}
        ref={timelineState}
        editorData={data}
        effects={mockEffect}
        onChange={(data) => {
          setData(data as CusTomTimelineRow[]);
        }}
        getActionRender={(action, row) => {
          if (action.effectId === 'effect0') {
            return (
              <CustomRender0
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          } else if (action.effectId === 'effect1') {
            return (
              <CustomRender1
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          } else if (action.effectId === 'effect2') {
            return (
              <CustomRender2
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          } else if (action.effectId === 'effect3') {
            return (
              <CustomRender3
                action={action as CustomTimelineAction}
                row={row as CusTomTimelineRow}
              />
            );
          }
        }}
      />
    </div>
  );
};

export default TimelineEditor;
