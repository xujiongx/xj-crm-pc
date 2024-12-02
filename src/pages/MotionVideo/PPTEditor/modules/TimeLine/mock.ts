import {
  TimelineAction,
  TimelineEffect,
  TimelineRow,
} from '@/components/react-timeline-edit';
import { CSSProperties } from 'react';
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
  const elRef = document.querySelector(`#element-${elId}`);
  console.log('👩‍🦳', elRef);
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
  const elRef = document.querySelector(`#element-${elId}`);
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
  };
}

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: '效果0',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        const data = (action as CustomTimelineAction).data;
        console.log('🤧', data);
        if (isPlaying) {
          runAnimation(
            data.elId,
            data.effect,
            data.end - data.start,
            data.type,
          );
        }
      },
      update: ({ action, engine, isPlaying, time }) => {},

      stop: ({ action, engine }) => {},
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
      leave: ({ action, engine, isPlaying, time }) => {
        const data = (action as CustomTimelineAction).data;
        console.log('🦸‍♀️', data, time, action.end);
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
  effect1: {
    id: 'effect1',
    name: '效果1',
  },
};

export const mockData: TimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action00',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '1',
    actions: [
      {
        id: 'action10',
        start: 1.5,
        end: 5,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '2',
    actions: [
      {
        id: 'action20',

        start: 1,
        end: 4,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '3',
    actions: [
      {
        id: 'action30',
        start: 0.5,
        end: 7,
        effectId: 'effect1',
      },
      {
        id: 'action31',
        start: 10,
        end: 12,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '4',
    actions: [
      {
        id: 'action40',
        start: 1,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '5',
    actions: [
      {
        id: 'action50',
        start: 2.5,
        end: 6,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '6',
    actions: [
      {
        id: 'action60',
        start: 3,
        end: 4,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '7',
    actions: [
      {
        id: 'action70',
        start: 2,
        end: 4,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '8',
    actions: [
      {
        id: 'action80',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '9',
    actions: [
      {
        id: 'action90',
        start: 1.5,
        end: 2,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '10',
    actions: [
      {
        id: 'action100',

        start: 3,
        end: 4,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '11',
    actions: [
      {
        id: 'action110',
        start: 1,
        end: 3,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '12',
    actions: [
      {
        id: 'action120',
        start: 0,
        end: 2,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '13',
    actions: [
      {
        id: 'action130',
        start: 1.5,
        end: 3,
        effectId: 'effect1',
      },
    ],
  },
  {
    id: '14',
    actions: [
      {
        id: 'action140',

        start: 0,
        end: 1,
        effectId: 'effect0',
      },
    ],
  },
  {
    id: '15',
    actions: [
      {
        id: 'action150',
        start: 1,
        end: 2,
        effectId: 'effect1',
      },
    ],
  },
];
