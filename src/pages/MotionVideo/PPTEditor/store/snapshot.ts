import dayjs from 'dayjs';
import { create } from 'zustand';
import { SlideItem } from '../interface';
import useMainStore from './main';
import useSlidesStore from './slides';
import { cloneDeep } from 'lodash';

/** 最大快照历史长度 */
const MaxSnapshotLength = 20;

type State = {
  /** 历史快照指针 */
  snapshotCursor: number;
  /** 快照历史 */
  snapshotHistory: Array<{
    time: number;
    slide: SlideItem;
  }>;
};

type Actions = {
  init: (slide: SlideItem) => void;
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
    return get().snapshotCursor < get().snapshotHistory.length - 1;
  },
  init: (slide: SlideItem) => {
    set(() => ({
      snapshotCursor: 0,
      snapshotHistory: [
        {
          time: dayjs().valueOf(),
          slide,
        },
      ],
    }));
  },
  undo: () => {
    if (!get().getCanUndo()) return;
    const snapshotCursor = get().snapshotCursor - 1;
    const snapshot = get().snapshotHistory[snapshotCursor];
    useSlidesStore.getState().setSlide(snapshot.slide);
    useMainStore.getState().setActiveElementIds([]);
    set(() => ({ snapshotCursor }));
  },
  redo: () => {
    if (!get().getCanRedo()) return;
    const snapshotCursor = get().snapshotCursor + 1;
    const snapshot = get().snapshotHistory[snapshotCursor];
    useSlidesStore.getState().setSlide(snapshot.slide);
    useMainStore.getState().setActiveElementIds([]);
    set(() => ({ snapshotCursor }));
  },
  add: () => {
    const { slides, slideIndex } = useSlidesStore.getState();
    let snapshotHistory = get().snapshotHistory;
    const limit = snapshotHistory.length - MaxSnapshotLength;
    snapshotHistory = snapshotHistory.splice(
      limit < 0 ? 0 : limit,
      get().snapshotCursor + 1,
    );
    snapshotHistory.push({
      time: dayjs().valueOf(),
      slide: cloneDeep(slides[slideIndex]),
    });
    set(() => ({
      snapshotHistory,
      snapshotCursor: snapshotHistory.length - 1,
    }));
  },
}));

export default useSnapshotStore;
