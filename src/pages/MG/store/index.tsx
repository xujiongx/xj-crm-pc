// import gsap from 'gsap';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
  elements: any[];
  timeLineData: [];
}

interface Actions {
  setElements: (elements) => void;
  updateElement: (element: any) => void;
  updateTimeLineData: (timeLineData) => void;
  timeLineDataAdd: (data) => void;
}

const initState: State = {
  elements: [],
  timeLineData: [],
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
    updateTimeLineData: (timeLineData) => {
      set({ timeLineData });
    },
    timeLineDataAdd: (data: any) => {
      set((state) => {
        state.timeLineData.push(data);
      });
    },
  })),
);

export default useTimelineStore;
