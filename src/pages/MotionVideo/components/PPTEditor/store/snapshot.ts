import { SlideItem } from '@/pages/MotionVideo/interface';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import useMainStore from './main';
import useSlidesStore from './slides';

/** 最大快照历史长度 */
const MaxSnapshotLength = 20;

// 修改 State 类型以存储多个 SlideItem
type State = {
  /** 历史快照指针 */
  snapshotCursor: number;
  /** 快照历史，存储多个 SlideItem */
  snapshotHistory: Array<{
    time: number;
    index: number;
    slides: SlideItem[];
  }>;
};

type Actions = {
  init: (slides: SlideItem[]) => void;
  undo: () => void;
  redo: () => void;
  add: () => void;
  getCanUndo: () => boolean;
  getCanRedo: () => boolean;
};

const useSnapshotStore = create<State & Actions>((set, get) => ({
  snapshotCursor: 0,
  snapshotHistory: [],
  getCanUndo: () => {
    return get().snapshotCursor > 0;
  },
  getCanRedo: () => {
    return get().snapshotHistory.length - 1 > get().snapshotCursor;
  },
  init: (slides: SlideItem[]) => {
    // 获取最新的 slideIndex
    const slideIndex = useSlidesStore.getState().slideIndex;
    set(() => ({
      snapshotCursor: 0,
      snapshotHistory: [
        {
          index: slideIndex,
          time: dayjs().valueOf(),
          slides: [...slides], // 存储多个 slide
        },
      ],
    }));
  },
  undo: () => {
    if (!get().getCanUndo()) return;
    const snapshotCursor = get().snapshotCursor - 1;
    const snapshot = get().snapshotHistory[snapshotCursor];
    // 更新多个 slide 的状态
    useSlidesStore.getState().setSlides(snapshot.slides);
    useSlidesStore.getState().updateSlideIndex(snapshot.index);
    useMainStore.getState().setActiveElementIds([]);
    set(() => ({ snapshotCursor }));
  },
  redo: () => {
    if (!get().getCanRedo()) return;
    const snapshotCursor = get().snapshotCursor + 1;
    const snapshot = get().snapshotHistory[snapshotCursor];
    // 更新多个 slide 的状态
    useSlidesStore.getState().setSlides(snapshot.slides);
    useSlidesStore.getState().updateSlideIndex(snapshot.index);
    useMainStore.getState().setActiveElementIds([]);
    set(() => ({ snapshotCursor }));
  },
  add: () => {
    // 获取最新的 slideIndex
    const slideIndex = useSlidesStore.getState().slideIndex;
    const slides = useSlidesStore.getState().slides;
    let snapshotHistory = get().snapshotHistory;
    const limit = snapshotHistory.length - MaxSnapshotLength;
    snapshotHistory = snapshotHistory.splice(
      limit < 0 ? 0 : limit,
      get().snapshotCursor + 1,
    );

    snapshotHistory.push({
      index: slideIndex,
      time: dayjs().valueOf(),
      slides: cloneDeep(slides), // 存储多个 slide 的副本
    });

    if (snapshotHistory.length > 2) {
      snapshotHistory[snapshotHistory.length - 2].index = slideIndex;
    }

    set(() => ({
      snapshotHistory,
      snapshotCursor: snapshotHistory.length - 1,
    }));
  },
}));

export default useSnapshotStore;
