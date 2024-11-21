import { Cell, Graph } from '@antv/x6';
import { message } from 'antd';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
interface State {
  graph: Graph | undefined;
  status: {
    canUndo: boolean;
    canRedo: boolean;
  };
  currentNode: Cell | undefined;
  currentNodes: Cell[];
}

interface Actions {
  setGraph: (graph: State['graph']) => void;
  setStatus: (state: State['status']) => void;
  setCurrentNode: (currentNode: State['currentNode']) => void;
  setCurrentNodes: (currentNodes: State['currentNodes']) => void;
  deleteNode: () => void;
  copyNode: () => void;
  pasteNode: () => void;
}

const initState: State = {
  graph: undefined,
  status: {
    canUndo: false,
    canRedo: false,
  },
  currentNode: undefined,
  currentNodes: [],
};

const useGraphStore = create(
  immer<State & Actions>((set, get) => ({
    ...initState,
    setGraph: (graph) => {
      set({ graph });
    },
    setStatus: (status) => {
      set({ status });
    },
    setCurrentNode: (currentNode) => {
      set({ currentNode });
    },
    setCurrentNodes: (currentNodes) => {
      set({ currentNodes });
    },
    deleteNode: () => {
      const { graph, currentNodes } = get();
      graph?.removeCells(currentNodes);
    },
    copyNode: () => {
      const { currentNodes, graph } = get();
      if (!currentNodes.length) return;
      graph?.copy(currentNodes);
    },
    pasteNode: () => {
      const { graph } = get();
      console.log('🌂', graph?.getCellsInClipboard());
      if (!graph?.isClipboardEmpty()) {
        graph?.paste({ offset: 32 });
        graph?.cleanSelection();
      } else {
        message.warning('剪切板无节点');
      }
    },
  })),
);

export default useGraphStore;
