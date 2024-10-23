import useMainStore from './store';
import { uid } from './utils';

export const useMaterialOperate = <T>() => {
  const preview = useMainStore((store) => store.preview);
  const configMaterial = useMainStore((store) => store.config.materials);
  const add = (item: any) => {
    useMainStore.getState().onAddElement<T>({
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
