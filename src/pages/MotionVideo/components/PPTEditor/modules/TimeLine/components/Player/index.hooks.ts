import { Modal } from 'antd';
import useCreateElement from '../../../../hooks/useCreateElement';
import { useMainStore, useSlidesStore } from '../../../../store';

export const useCaption = () => {
  const isOpenCaption = useMainStore((store) => store.isOpenCaption);
  const setIsOpenCaption = useMainStore((store) => store.setIsOpenCaption);

  const { createCaptionElement } = useCreateElement();

  const deleteElement = useSlidesStore((store) => store.deleteElement);
  const activeElementId = useMainStore((store) => store.activeElementId);

  const deleteCaption = () => {
    deleteElement(activeElementId);
  };

  const addCaption = () => {
    createCaptionElement();
  };

  const handleSwitchCaption = () => {
    if (isOpenCaption) {
      Modal.confirm({
        title: '是否关闭字幕，关闭字幕后所有的字幕元素都将被删除！',
        onOk: () => {
          setIsOpenCaption(false);
          deleteCaption();
        },
      });
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
