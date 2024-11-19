import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { History } from '@antv/x6-plugin-history';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Transform } from '@antv/x6-plugin-transform';
import { useEffect, useRef, useState } from 'react';
import useStore from '../store';
export const useGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dnd, setDnd] = useState<Dnd | null>(null);

  const { state, graph } = useStore((state) => state);

  const init = (container) => {
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
      connecting: {
        allowNode: false,
        allowBlank: false,
        highlight: true,
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
              },
            },
          });
        },
        validateMagnet({ magnet }) {
          // 节点上方的连接桩无法创建连线
          return magnet.getAttribute('port-group') !== 'top';
        },
        validateConnection({
          sourceCell,
          targetCell,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不能连接自身
          if (sourceCell === targetCell) {
            return false;
          }

          // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'top'
          ) {
            return false;
          }
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'top'
          ) {
            return false;
          }

          // 不能重复连线
          const edges = this.getEdges();
          console.log('🤰edges', edges, targetMagnet);
          const portId = targetMagnet.getAttribute('port');
          if (edges.find((edge) => edge.getTargetPortId() === portId)) {
            return false;
          }

          return true;
        },
      },
      highlighting: {
        // 连接桩可以被连接时在连接桩外围围渲染一个包围框
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#A4DEB1',
              strokeWidth: 4,
            },
          },
        },
        // 连接桩吸附连线时在连接桩外围围渲染一个包围框
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
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
        rotating: {
          enabled: true,
        },
      }),
    );
    graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
    );

    graph.on('history:change', () => {
      console.log('😄', graph.canRedo(), graph.canUndo());
      useStore.getState().setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      });
    });
    graph.on('node:selected', ({ node, options }) => {
      const nodes = graph?.getSelectedCells();
      console.log('🧢nodes', nodes, node, options);
      if (nodes.length === 1) {
        useStore.getState().setCurrentNode(nodes[0]);
      }
    });

    useStore.getState().setGraph(graph);

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
    state,
    containerRef,
    isLoaded,
    dnd,
  };
};
