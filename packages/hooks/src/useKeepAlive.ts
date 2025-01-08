import { fixKeepAliveContext } from '@aicc/shared';
import { MicroStoreType } from '@aicc/types/micro';
import { useEffect } from 'react';
import { AliveController } from 'react-activation';

fixKeepAliveContext();

const useKeepAlive = ({
  microStore,
  useAliveController,
}: {
  microStore?: MicroStoreType;
  useAliveController: () => AliveController;
}) => {
  const { dropScope, refreshScope, getCachingNodes } = useAliveController();

  useEffect(() => {
    microStore?.emitter.on('layout:menu:click', async ({ path }) => {
      const nodes = getCachingNodes();
      nodes.forEach(async (node) => {
        if (node.name === path) {
          await refreshScope(node.name!);
        } else {
          await dropScope(node.name!);
        }
      });
    });
  }, []);
};

export default useKeepAlive;
