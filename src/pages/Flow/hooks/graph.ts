import { Dnd } from '@antv/x6-plugin-dnd';
import { useEffect, useRef, useState } from 'react';
import useGraphStore from '../store';
import { useGraphUtils } from './utils';

export const useGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dnd, setDnd] = useState<Dnd | null>(null);

  const status = useGraphStore((state) => state.status);
  const graph = useGraphStore((state) => state.graph);

  const { initKeyboard, setAllUse, setAllEvent, initialEdge, initGraph } =
    useGraphUtils();

  const init = (container) => {
    initialEdge();

    const graph = initGraph(container);

    setAllUse(graph);

    setAllEvent(graph);

    initKeyboard(graph);

    useGraphStore.getState().setGraph(graph);

    const dnd = new Dnd({
      target: graph,
    });
    setDnd(dnd);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    init(containerRef.current);
    setIsLoaded(true);
  }, [containerRef.current]);

  return {
    graph,
    status,
    containerRef,
    isLoaded,
    dnd,
  };
};
