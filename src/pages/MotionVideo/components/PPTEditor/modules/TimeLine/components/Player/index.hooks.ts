import { useMainStore } from '../../../../store';

export const useCaption = () => {
  const isOpenCaption = useMainStore((store) => store.isOpenCaption);
  const setIsOpenCaption = useMainStore((store) => store.setIsOpenCaption);

  const deleteCaption = () => {};

  const addCaption = () => {};

  const handleSwitchCaption = () => {
    if (isOpenCaption) {
      setIsOpenCaption(false);
      deleteCaption();
    } else {
      setIsOpenCaption(true);
      addCaption();
    }
  };

  return {
    isOpenCaption,
    handleSwitchCaption,
  };
};
