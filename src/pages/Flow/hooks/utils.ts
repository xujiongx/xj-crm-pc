import { Edge, Graph, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import useGraphStore from '../store';

export const useGraphUtils = () => {
  /**
   * 更改连接桩显示
   * @param visible
   */
  const changePortsVisible = (graph: Graph, visible: boolean) => {
    const ports = graph?.container.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>;
    ports.forEach((port) => {
      port.style.visibility = visible ? 'visible' : 'hidden';
    });
  };

  /** 鼠标进入 */
  const edgeMouseenter = ({ edge }: { edge: Edge<Edge.Properties> }) => {
    edge.addTools(
      [
        {
          name: 'button-remove',
          args: { distance: -30 },
        },
      ],
      { ignoreHistory: true },
    );
  };
  /** 鼠标离开 */
  const edgeMouseleave = ({ edge }: { edge: Edge<Edge.Properties> }) => {
    edge.removeTools({ ignoreHistory: true });
  };

  /**
   * 键盘监控
   * @param graph
   */
  const initKeyboard = (graph: Graph) => {
    graph.bindKey(['backspace', 'delete'], () => {
      useGraphStore.getState().deleteNode();
    });
    // 复制
    graph.bindKey(['command+c', 'ctrl+c'], () => {
      useGraphStore.getState().copyNode();
    });
    // 粘贴
    graph.bindKey(['command+v', 'ctrl+v'], () => {
      useGraphStore.getState().pasteNode();
    });
    // 撤销
    graph.bindKey(['command+z', 'ctrl+z'], () => {
      graph.undo();
    });
    // 重做
    graph.bindKey(['command+shift+z', 'ctrl+shift+z'], () => {
      graph.redo();
    });
  };

  /**
   * 使用插件
   * @param graph
   */
  const setAllUse = (graph) => {
    graph.use(new Keyboard({ enabled: true }));
    graph.use(
      new Snapline({
        enabled: true,
      }),
    );
    graph.use(
      new History({
        enabled: true,
        beforeAddCommand(event: string, args: any) {
          // 自定义忽略属性
          return !args.options.ignoreHistory;
        },
      }),
    );
    // graph.use(
    //   new Scroller({
    //     enabled: true,
    //     pageVisible: false,
    //     pageBreak: false,
    //     pannable: true,
    //     autoResizeOptions: {
    //       border: 200,
    //     },
    //   }),
    // );
    graph.use(new Clipboard({ enabled: true }));
    // graph.use(
    //   new Transform({
    //     resizing: {
    //       enabled: true,
    //       orthogonal: true,
    //     },
    //     rotating: {
    //       enabled: true,
    //     },
    //   }),
    // );
    graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      }),
    );
  };

  /**
   * 事件
   * @param graph
   */
  const setAllEvent = (graph) => {
    graph.on('history:change', () => {
      console.log('😄', graph.canRedo(), graph.canUndo());
      useGraphStore.getState().setStatus({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      });
    });
    graph.on('node:selected', ({ node, options }) => {
      const nodes = graph?.getSelectedCells();
      console.log('🧢nodes', nodes, node, options);
      useGraphStore.getState().setCurrentNodes(nodes);
    });

    // 线鼠标移入
    graph.on('edge:mouseenter', edgeMouseenter);
    // 线鼠标移出
    graph.on('edge:mouseleave', edgeMouseleave);

    // 节点鼠标移入
    graph.on('node:mouseenter', () => {
      changePortsVisible(graph, true);
    });

    // 节点鼠标移出
    graph.on('node:mouseleave', () => {
      changePortsVisible(graph, false);
    });
  };

  /**
   * 初始化连线
   */
  const initialEdge = () => {
    Shape.Edge.config({
      zIndex: 0,
      defaultLabel: {
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          text: {
            fill: '#666',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
          },
          body: {
            ref: 'label',
            fill: '#eee',
            refWidth: '128%',
            refHeight: '128%',
            refX: '-14%',
            refY: '-14%',
          },
        },
        position: {
          distance: 0.5,
        },
      },
      attrs: {
        line: {
          stroke: '#ccd1d8',
          strokeWidth: 2,
          targetMarker: {
            name: 'block',
            size: 7,
          },
        },
      },
    });
  };

  /**
   * 初始化画布
   * @param container
   * @returns
   */
  const initGraph = (container) => {
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
      // 是否允许画布平移
      panning: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      // 滚轮缩放
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 6,
            attrs: {
              opacity: 0.6,
              stroke: '#39ca74',
              'stroke-width': 8,
            },
          },
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            padding: 6,
            attrs: {
              stroke: '#39ca74',
              'stroke-width': 8,
            },
          },
        },
      },
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
    });

    return graph;
  };

  return {
    initGraph,
    initKeyboard,
    initialEdge,
    changePortsVisible,
    setAllUse,
    setAllEvent,
  };
};
