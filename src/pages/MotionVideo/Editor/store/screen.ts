import { create } from 'zustand';

type State = {
  screening: boolean;
};

type Actions = {
  setScreening(screening: boolean): void;
};

const useScreenStore = create<State & Actions>((set, get) => ({
  screening: false,
  setScreening(screening) {
    set({ screening });
  },
}));

export default useScreenStore;
