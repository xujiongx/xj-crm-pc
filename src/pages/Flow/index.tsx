import { useEffect } from 'react';
import { useGraph } from './hooks/graph';
import { useRegister } from './hooks/register';
import styles from './index.less';
import ConfigRender from './modules/config';
import ContainerRender from './modules/container';
import Elements from './modules/elements';
import Operate from './modules/operate';

const Page: React.FC = () => {
  const { containerRef, graph, status, isLoaded, dnd } = useGraph();

  useRegister();

  useEffect(() => {
    if (!isLoaded || !graph) return;
    const flowData = JSON.parse(localStorage.getItem('graph') || '{}');
    if (flowData) {
      graph.fromJSON(flowData);
    }
  }, [graph, isLoaded]);

  return (
    <div>
      <div>header</div>
      <div className={styles['main']}>
        <div>
          <Elements dnd={dnd} graph={graph} />
        </div>
        <div>
          <Operate graph={graph} status={status} />
          <ContainerRender containerRef={containerRef} />
        </div>
        <div>
          <ConfigRender />
        </div>
      </div>
      <div>bottom</div>
    </div>
  );
};

export default Page;
