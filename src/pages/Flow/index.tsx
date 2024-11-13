import { Node } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { Button, Dropdown } from 'antd';
import { useEffect } from 'react';
import { useGraph } from './hooks';
import styles from './index.less';

const CustomComponent = ({ node }: { node: Node }) => {
  const label = node.prop('label');
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'copy',
            label: '复制',
          },
          {
            key: 'paste',
            label: '粘贴',
          },
          {
            key: 'delete',
            label: '删除',
          },
        ],
      }}
      trigger={['contextMenu']}
    >
      <div className={styles['custom-react-node']}>{label}</div>
    </Dropdown>
  );
};

register({
  shape: 'custom-react-node',
  width: 100,
  height: 40,
  component: CustomComponent,
});

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'custom-react-node',
      x: 40,
      y: 40,
      label: 'hello',
    },
    {
      id: 'node2',
      shape: 'custom-react-node',
      x: 160,
      y: 180,
      label: 'world',
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
};

const Page: React.FC = () => {
  const { graph, state } = useGraph();

  useEffect(() => {
    if (!graph.fromJSON) return;
    graph.fromJSON(data);
  }, [graph]);

  const exportGraph = () => {
    const json = graph.toJSON();
    console.log('json:', json);
  };

  const addShape = () => {
    graph.addNode({
      shape: 'rect',
      width: 100,
      height: 40,
      x: 100,
      y: 100,
      label: 'edge',
    });
  };
  const addEdge = () => {
    graph.addEdge({
      shape: 'edge',
    });
  };

  return (
    <div>
      <div style={{ width: '100%', height: '600px' }}>
        <div id="container"></div>
      </div>
      <Button onClick={() => graph.undo()} disabled={!state.canUndo}>
        撤销
      </Button>
      <Button onClick={() => graph.redo()} disabled={!state.canRedo}>
        重做
      </Button>
      <Button onClick={() => exportGraph()}>导出</Button>
      <Button onClick={() => addShape()}>新增</Button>
      <Button onClick={() => addEdge()}>新增边</Button>
    </div>
  );
};

export default Page;
