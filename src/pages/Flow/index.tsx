import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGraph } from './hooks/graph';
import { useRegister } from './hooks/register';
import styles from './index.less';
import ConfigRender from './modules/config';
import ContainerRender from './modules/container';
import Elements from './modules/elements';
import Operate from './modules/operate';

const Page: React.FC = () => {
  const { containerRef, graph, state, isLoaded, dnd } = useGraph();

  useRegister();

  useEffect(() => {
    if (!isLoaded || !graph) return;
    const flowData = JSON.parse(localStorage.getItem('graph') || '{}');
    if (flowData) {
      graph.fromJSON(flowData);
    }
  }, [graph, isLoaded]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div>header</div>
      <div className={styles['main']}>
        <div>
          <Elements dnd={dnd} graph={graph} />
        </div>
        <div>
          <Operate graph={graph} state={state} />
          <ContainerRender containerRef={containerRef} />
        </div>
        <div>
          <ConfigRender />
        </div>
      </div>
      <div>bottom</div>
    </DndProvider>
  );
};

export default Page;
