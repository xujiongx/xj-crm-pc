import {
  TimelineAction,
  TimelineEffect,
} from '@/components/react-timeline-edit';
import { CSSProperties } from 'react';
import videoPlayerControl from '../Canvas/components/EditableElement/Element/VideoElement/videoControl';
import { ANIMATION_CLASS_PREFIX } from '../../config';

export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 10;

// 执行动画预览
const runAnimation = (
  elId: string,
  effect: string,
  duration: number,
  type?: any,
) => {
  const elRef = document.querySelector(`#element-${elId}`) as HTMLElement;
  if (elRef) {
    const animationName = `${ANIMATION_CLASS_PREFIX}${effect}`;
    document.documentElement.style.setProperty(
      '--animate-duration',
      `${duration * 1000}ms`,
    );
    elRef.style['visibility'] = 'visible';
    elRef.classList.add(`${ANIMATION_CLASS_PREFIX}animated`, animationName);

    const handleAnimationEnd = () => {
      document.documentElement.style.removeProperty('--animate-duration');
      elRef.classList.remove(
        `${ANIMATION_CLASS_PREFIX}animated`,
        animationName,
      );
      if (type === 'out') {
        elRef.style['visibility'] = 'hidden';
      }
    };
    elRef.addEventListener('animationend', handleAnimationEnd, {
      once: true,
    });
  }
};

const setElementProperty = (elId, style: CSSProperties) => {
  const elRef = document.querySelector(`#element-${elId}`) as HTMLElement;
  if (elRef) {
    Object.keys(style).forEach((key) => {
      elRef.style[key] = style[key];
    });
  }
};

export interface CustomTimelineAction extends TimelineAction {
  data: {
    id?: string;
    src: string;
    name: string;
    text?: string;
    type?: string;
    elId: string;
    effect: string;
    end: number;
    start: number;
  };
}

export const mockEffect: Record<string, TimelineEffect> = {
  animate: {
    id: 'effect0',
    name: '动画',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
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
      enter: ({ action, engine, isPlaying, time }) => {
        const data = (action as CustomTimelineAction).data;
        if (isPlaying) {
          runAnimation(
            data.elId,
            data.effect,
            data.end - data.start,
            data.type,
          );
        }
        setElementProperty(data.elId, {
          visibility: 'visible',
        });
      },
      update: ({ action, engine, isPlaying, time }) => {
        const data = (action as CustomTimelineAction).data;
        if (time === 0) {
          if (
            (data.type === 'out' && time > action.end) ||
            (data.type === 'in' &&
              data.effect !== 'show' &&
              time <= action.start)
          ) {
            setElementProperty(data.elId, {
              visibility: 'hidden',
            });
          }
        } else {
          setElementProperty(data.elId, {
            visibility: 'visible',
          });
        }
      },
      leave: ({ action, engine, isPlaying, time }) => {
        const data = (action as CustomTimelineAction).data;
        if (
          (data.type === 'out' && time > action.end) ||
          (data.type === 'in' && data.effect !== 'show' && time < action.start)
        ) {
          setElementProperty(data.elId, {
            visibility: 'hidden',
          });
        } else {
          setElementProperty(data.elId, {
            visibility: 'visible',
          });
        }
      },
    },
  },
  video: {
    id: 'video1',
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
        // Example usage:
        videoPlayerControl.start({
          id: data.elId,
          engine: engine,
          startTime: action.start,
          time: time,
        });
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
  effect1: {
    id: 'effect1',
    name: '效果1',
  },
};
