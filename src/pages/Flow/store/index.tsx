import { Cell, Graph } from '@antv/x6';
import { create } from 'zustand';

interface State {
  graph: Graph | null;
  state: {
    canUndo: boolean;
    canRedo: boolean;
  };
  currentNode: Cell | null;
}

const initState: State = {
  graph: null,
  state: {
    canUndo: false,
    canRedo: false,
  },
  currentNode: null,
};

const useStore = create((set: any, get: any) => ({
  ...initState,
  setGraph: (graph) => {
    set({ graph });
  },
  setState: (state) => {
    set({ state: { ...get().state, ...state } });
  },
  setCurrentNode: (currentNode) => {
    set({ currentNode });
  },
  deleteNode: () => {
    const { currentNode } = get();
    if (!currentNode) return;
    currentNode.remove();
  },
}));

export default useStore;
