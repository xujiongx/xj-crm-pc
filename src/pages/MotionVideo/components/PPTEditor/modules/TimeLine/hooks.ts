import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTElement } from '@/pages/MotionVideo/interface';
import { MenuProps } from 'antd';
import useDragElement from '../../hooks/useDragElement';
import useSelectElement from '../Canvas/hooks/useSelectElement';

export const useTimeLine = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();
  const { updateSlide } = useSlidesStore((state) => state);

  // 修改元素动画
  const updateAnimation = (id: string, data: any) => {
    const animations = currentSlideAnimations.map((item) => {
      if (item.id === id) return { ...item, ...data };
      return item;
    });
    updateSlide({ animations });
    addHistorySnapshot();
  };

  return {
    updateAnimation,
  };
};

export const useElement = () => {
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const { drag } = useDragElement(currentSlide?.elements, () => {});

  const { select } = useSelectElement(currentSlide?.elements, drag);

  const handleSelectElement = (e: any, item: PPTElement) => {
    select(e, item, false);
  };

  return {
    handleSelectElement,
  };
};

/**
 * useMenu 自定义 Hook
 * 用于处理右键菜单的相关逻辑，包括菜单列表的生成和菜单事件的处理
 * @returns 包含菜单列表和菜单点击事件处理函数的对象
 */
export const useMenu = () => {
  // 从 useMainStore 中获取当前激活元素的 ID 数组
  const deleteAnimation = useSlidesStore((store) => store.deleteAnimation);

  const activeActionId = useMainStore((store) => store.activeActionId);

  // 定义右键菜单元素列表，根据选择的元素情况进行筛选
  const CONTEXTMENU_Ele = [
    {
      key: 'delete',
      label: '删除',
    },
  ];

  // 根据是否有激活元素，选择显示不同的菜单列表
  const menuItems: MenuProps['items'] = activeActionId
    ? CONTEXTMENU_Ele
    : undefined;

  // 右键菜单点击事件处理函数集合
  const contextMenuClickFn = {
    // 删除元素的处理函数
    delete: function () {
      deleteAnimation(activeActionId);
    },
  };

  return {
    menuItems,
    contextMenuClickFn,
  };
};

export const useTimeLineHandleClick = () => {
  const activeActionId = useMainStore((state) => state.activeActionId);
  const setActiveActionId = useMainStore((state) => state.setActiveActionId);

  const handleClickBlankArea = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // 若点击了右键菜单按钮，则不进行操作
    if (document.querySelector('#contextMenuID')?.contains(e.target as Node))
      return;
    // 若有激活元素，清空激活元素 ID 数组
    if (activeActionId.length) {
      setActiveActionId('');
    }
  };

  return {
    handleClickBlankArea,
  };
};
