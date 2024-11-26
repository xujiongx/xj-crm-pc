import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
interface State {
  elements: any[];
  timeLines: [];
}

interface Actions {
  setElements: (elements) => void;
  updateElement: (element: any) => void;
  setTimeLines: (timeLineData) => void;
  addTimeLine: (data) => void;
}

const initState: State = {
  elements: [],
  timeLines: [],
};

const useTimelineStore = create(
  immer<State & Actions>((set, get) => ({
    ...initState,
    setElements: (elements) => {
      set({ elements });
    },
    updateElement: (element: any) => {
      set((state) => {
        // 如果没有就添加
        if (!state.elements.find((item: any) => item.id === element.id)) {
          state.elements.push(element);
        }

        // 如果有就更新
        state.elements = state.elements.map((item: any) => {
          if (item.id === element.id) {
            return { ...item, ...element };
          }
          return item;
        });
      });
    },
    setTimeLines: (timeLines) => {
      console.log('👩‍🍳', timeLines, cloneDeep(timeLines));
      set({ timeLines: cloneDeep(timeLines) });
    },
    addTimeLine: (data: any) => {
      set((state) => {
        const item = cloneDeep(data);
        state.timeLines.push(item);
      });
    },
  })),
);

export default useTimelineStore;
