import {
  TimelineAction,
  TimelineEffect,
} from '@/components/react-timeline-edit';
import audioControl from '@/pages/MotionVideo/elements/Element/Audio/audioControl';
import videoPlayerControl from '@/pages/MotionVideo/elements/Element/VideoElement/videoControl';
import { runAnimation, setElementVisibility } from './utils';

export const scaleWidth = 160;
export const startLeft = 10;

export interface CustomTimelineAction extends TimelineAction {
  data: {
    id: string;
    src: string;
    name: string;
    text?: string;
    type?: string;
    elId: string;
    effect: string;
    end: number;
    start: number;
    volume: number;
  };
}

/**
 * animate.css动效
 *
 * video播放暂停
 */
export const mockEffect: Record<string, TimelineEffect> = {
  animate: {
    id: 'animate',
    name: '动画',
    source: {
      start: ({ action }) => {
        const data = (action as CustomTimelineAction).data;
        runAnimation(data.elId, data.effect, data.end - data.start, data.type);
      },
      enter: ({ action, isPlaying }) => {
        const data = (action as CustomTimelineAction).data;
        if (isPlaying) {
          runAnimation(
            data.elId,
            data.effect,
            data.end - data.start,
            data.type,
          );
        }
      },
      update: ({ action, time, isPlaying }) => {
        const data = (action as CustomTimelineAction).data;
        if (time === 0) {
          if (
            (data.type === 'out' && time >= action.end) ||
            (data.type === 'in' &&
              data.effect !== 'show' &&
              time <= action.start)
          ) {
            setElementVisibility(data.elId, false);
          }
        } else {
          if (isPlaying) return;
          setElementVisibility(data.elId, true);
        }
      },
      leave: ({ action, time }) => {
        const data = (action as CustomTimelineAction).data;
        if (
          (data.type === 'out' && time >= action.end) ||
          (data.type === 'in' && data.effect !== 'show' && time <= action.start)
        ) {
          setElementVisibility(data.elId, false);
        }
      },
    },
  },
  video: {
    id: 'video',
    name: '视频',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (!isPlaying) return;
        const data = (action as CustomTimelineAction).data;
        videoPlayerControl.start({
          id: data.elId,
          engine: engine,
          startTime: action.start,
          time: time,
        });
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (!isPlaying) return;
        const data = (action as CustomTimelineAction).data;
        videoPlayerControl.start({
          id: data.elId,
          engine: engine,
          startTime: action.start,
          time: time,
        });
      },
      update: ({ action }) => {
        const data = (action as CustomTimelineAction).data;
        setElementVisibility(data.elId, true);
      },
      stop: ({ action, engine }) => {
        const data = (action as CustomTimelineAction).data;
        videoPlayerControl.stop({
          id: data.elId,
          engine: engine,
        });
      },
      leave: ({ action, engine }) => {
        const data = (action as CustomTimelineAction).data;
        videoPlayerControl.stop({
          id: data.elId,
          engine: engine,
        });
      },
    },
  },
  audio: {
    id: 'audio',
    name: '音频',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const { id, src, volume } = (action as CustomTimelineAction).data;
          audioControl.start({
            id,
            src,
            startTime: action.start,
            engine,
            time,
            volume,
          });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const { id, src, volume } = (action as CustomTimelineAction).data;
          console.log('👿', action, src);
          audioControl.start({
            id,
            src,
            startTime: action.start,
            engine,
            time,
            volume,
          });
        }
      },
      leave: ({ action, engine }) => {
        const { id } = (action as CustomTimelineAction).data;
        audioControl.stop({ id, engine });
      },
      stop: ({ action, engine }) => {
        const { id } = (action as CustomTimelineAction).data;
        audioControl.stop({ id, engine });
      },
    },
  },
};
