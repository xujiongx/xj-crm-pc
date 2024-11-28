import {
  TimelineAction,
  TimelineEffect,
  TimelineRow,
} from '@/components/react-timeline-edit';
import { uid } from '@aicc/shared/es';
import useTimelineStore from '../../store';
import audioControl from './audioControl';
import lottieControl from './lottieControl';

export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 20;

export interface CustomTimelineAction extends TimelineAction {
  data: {
    id?: string;
    src: string;
    name: string;
    text?: string;
    type?: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: '播放音效',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      leave: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
      stop: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
    },
  },
  effect1: {
    id: 'effect1',
    name: '播放动画',
    source: {
      enter: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.enter({
          id: src,
          src,
          startTime: action.start,
          endTime: action.end,
          time,
        });
      },
      update: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.update({
          id: src,
          src,
          startTime: action.start,
          endTime: action.end,
          time,
        });
      },
      leave: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.leave({
          id: src,
          startTime: action.start,
          endTime: action.end,
          time,
        });
      },
    },
  },
  effect2: {
    id: 'effect2',
    name: '播放文本',
    source: {
      enter: ({ action, time }) => {
        const { id, type, name } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          type,
          name,
          start: action.start,
          end: action.end,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
          visible: true,
        });
      },
      start: ({ action, time }) => {
        const { id } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
        });
      },
      update: ({ action, time }) => {
        const { id } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
        });
      },
      stop: ({ action, time }) => {
        const { id } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          time,
          duration: action.end - action.start,
          process: (time - action.start) / (action.end - action.start),
        });
      },
      leave: ({ action, time }) => {
        const { id } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
          visible: false,
        });
      },
    },
  },
  effect3: {
    id: 'effect3',
    name: '图片',
    source: {
      enter: ({ action, time }) => {
        const { id, type, name, src } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          type,
          src,
          name,
          start: action.start,
          end: action.end,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
          visible: true,
          status: 'enter',
        });
      },
      start: ({ action, time }) => {
        const { id, type, name, src } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          status: 'start',
        });
      },
      leave: ({ action, time }) => {
        const { id, type, name, src } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          status: 'leave',
          visible: false,
        });
      },
      update: ({ action, time }) => {
        const { id, type, name, src } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          time,
          duration: action.end - action.start,
          progress: (time - action.start) / (action.end - action.start),
          status: 'update',
        });
      },
      stop: ({ action, time }) => {
        const { id, type, name, src } = (action as CustomTimelineAction).data;
        useTimelineStore.getState().updateElement({
          id,
          status: 'stop',
        });
      },
    },
  },
};

export const mockData: CusTomTimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action01',
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
        id: 'action02',
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
        id: 'action0',
        start: 10,
        end: 16,
        effectId: 'effect1',
        data: {
          src: '/zdarcy/lottie/lottie1/data.json',
          name: '点赞',
        },
      },
    ],
  },
  {
    id: '1',
    actions: [
      {
        id: 'action1',
        start: 5,
        end: 9.5,
        effectId: 'effect1',
        data: {
          src: '/zdarcy/lottie/lottie2/data.json',
          name: '工作',
        },
      },
      {
        id: 'action12',
        start: 10,
        end: 15,
        effectId: 'effect3',
        data: {
          id: uid(),
          src: require('@/assets/designer/card.png'),
          text: '我是图片',
          name: '图片',
          type: 'image',
        },
      },
    ],
  },
  {
    id: '2',
    actions: [
      {
        id: 'action21',
        start: 0,
        end: 5,
        effectId: 'effect1',
        data: {
          src: '/zdarcy/lottie/lottie2/data.json',
          name: '工作',
        },
      },
      {
        id: 'action2',
        start: 5,
        end: 10,
        effectId: 'effect1',
        data: {
          src: '/zdarcy/lottie/lottie3/data.json',
          name: '奶牛',
        },
      },
    ],
  },
  {
    id: '3',
    actions: [
      {
        id: 'action3',
        start: 0,
        end: 20,
        effectId: 'effect0',
        data: {
          src: require('@/assets/bg.mp3'),
          name: '背景音乐',
        },
      },
    ],
  },
];
