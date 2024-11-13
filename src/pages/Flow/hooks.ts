import { Graph } from '@antv/x6';
import { History } from '@antv/x6-plugin-history';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import { useSetState } from 'ahooks';
import { useEffect, useState } from 'react';

export const useGraph = () => {
  const [graph, setGraph] = useState<Graph>({} as Graph);
  const [state, setState] = useSetState({
    canUndo: false,
    canRedo: false,
  });

  const init = () => {
    const container = document.getElementById('container');
    if (!container) return;
    const graph = new Graph({
      container,
      autoResize: true,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      panning: true,
      mousewheel: true,
    });
    graph.use(
      new Snapline({
        enabled: true,
      }),
    );
    graph.use(
      new History({
        enabled: true,
      }),
    );
    graph.use(
      new Transform({
        resizing: {
          enabled: true,
          orthogonal: true,
        },
      }),
    );

    graph.on('history:change', () => {
      setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      });
    });

    setGraph(graph);
  };

  useEffect(() => {
    init();
  }, []);

  return {
    graph,
    state,
  };
};
