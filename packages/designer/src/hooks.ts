import useMainStore from './store';
import { uid } from './utils';

export const useMaterialOperate = () => {
  const preview = useMainStore((store) => store.preview);
  const configMaterial = useMainStore((store) => store.config.materials);
  const add = (item: any) => {
    useMainStore.getState().onAddElement({
      ...item,
      id: uid(),
    });
  };

  return {
    preview,
    configMaterial,
    add,
  };
};
