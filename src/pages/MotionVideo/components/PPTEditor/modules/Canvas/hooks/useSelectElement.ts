import { PPTElement } from '@/pages/MotionVideo/interface';
import { message } from 'antd';
import { uniq } from 'lodash';
import useKeyboardStore from '../../../store/keyboard';
import useMainStore from '../../../store/main';

const useSelectElement = (
  elements: PPTElement[],
  onMove: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTElement,
  ) => void,
) => {
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const activeGroupElementId = useMainStore(
    (store) => store.activeGroupElementId,
  );
  const setActiveGroupElementId = useMainStore(
    (store) => store.setActiveGroupElementId,
  );
  const activeElementId = useMainStore((store) => store.activeElementId);
  const setEditorareaFocus = useMainStore((store) => store.setEditorareaFocus);
  const editorAreaFocus = useMainStore((store) => store.editorAreaFocus);
  const { setActiveElementIds, setActiveElementId } = useMainStore();
  const ctrlOrShiftKeyActive = useKeyboardStore(
    (store) => store.ctrlKeyState || store.shiftKeyState,
  );

  const select = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTElement,
    canMove = true,
  ) => {
    if (!editorAreaFocus) setEditorareaFocus(true);
    if (element.lock) {
      message.warning('该元素已被锁定，请先在时间轴图层区域解锁元素。');
      return;
    }
    // 如果目标元素当前未被选中，则将他设为选中状态
    // 此时如果按下Ctrl键或Shift键，则进入多选状态，将当前已选中的元素和目标元素一起设置为选中状态，否则仅将目标元素设置为选中状态
    // 如果目标元素是分组成员，需要将该组合的其他元素一起设置为选中状态
    if (!activeElementIds.includes(element.id)) {
      let newActiveIdList: string[] = [];
      if (ctrlOrShiftKeyActive) {
        newActiveIdList = [...activeElementIds, element.id];
      } else newActiveIdList = [element.id];
      if (element.groupId) {
        const groupMembersId: string[] = [];
        elements.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id);
        });
        newActiveIdList = [...newActiveIdList, ...groupMembersId];
      }
      setActiveElementIds(uniq(newActiveIdList));
      setActiveElementId(element.id);
    }
    // 如果目标元素已被选中，且按下了Ctrl键或Shift键，则取消其被选中状态
    // 除非目标元素是最后的一个被选中元素，或者目标元素所在的组合是最后一组选中组合
    // 如果目标元素是分组成员，需要将该组合的其他元素一起取消选中状态
    else if (ctrlOrShiftKeyActive) {
      let newActiveIdList: string[] = [];

      if (element.groupId) {
        const groupMembersId: string[] = [];
        elements.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id);
        });
        newActiveIdList = activeElementIds.filter(
          (id) => !groupMembersId.includes(id),
        );
      } else {
        newActiveIdList = activeElementIds.filter((id) => id !== element.id);
      }

      if (newActiveIdList.length > 0) {
        setActiveElementIds(newActiveIdList);
      }
    }

    // 如果目标元素已被选中，同时目标元素不是当前操作元素，则将其设置为当前操作元素
    else if (activeElementId !== element.id) {
      setActiveElementId(element.id);
    }
    // 如果目标元素已被选中，同时也是当前操作元素，那么当目标元素在该状态下再次被点击时，将被设置为多选元素中的激活成员
    else if (activeGroupElementId !== element.id) {
      const startPageX = e.pageX;
      const startPageY = e.pageY;

      (e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX;
        const currentPageY = e.pageY;

        if (startPageX === currentPageX && startPageY === currentPageY) {
          setActiveGroupElementId(element.id);
          (e.target as HTMLElement).onmouseup = null;
        }
      };
    }

    if (canMove && !element.lock) onMove(e, element);
  };

  return {
    select,
  };
};

export default useSelectElement;
