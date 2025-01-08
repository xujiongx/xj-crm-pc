import { PPTElement, PPTShapeElement } from '@/pages/MotionVideo/interface';
import { CreateCustomShapeData } from '@/pages/MotionVideo/types/edit';
import { removeAllRanges } from '@/pages/MotionVideo/utils/selection';
import { MenuProps } from 'antd';
import useClipboard from '../../hooks/useClipboard';
import useCombineElement from '../../hooks/useCombineElement';
import useCreateElement from '../../hooks/useCreateElement';
import useInsertFromCreateSelection from '../../hooks/useInsertFromCreateSelection';
import useLockElement from '../../hooks/useLockElement';
import useViewportSize from '../../hooks/useViewportSize';
import { useKeyboardStore, useMainStore, useSlidesStore } from '../../store';
import useMouseSelection from './hooks/useMouseSelection';

/**
 * useMenu 自定义 Hook
 * 用于处理右键菜单的相关逻辑，包括菜单列表的生成和菜单事件的处理
 * @returns 包含菜单列表和菜单点击事件处理函数的对象
 */
export const useMenu = () => {
  // 从 useMainStore 中获取当前激活元素的 ID 数组
  const activeElementIds = useMainStore((store) => store.activeElementIds);

  const showRuler = useMainStore((store) => store.showRuler);
  const setShowRuler = useMainStore((store) => store.setShowRuler);

  // 从 useMainStore 中获取处理元素的函数
  const handleElement = useMainStore((store) => store.handleElement)();
  // 从 useSlidesStore 中获取当前激活元素的数组
  const activeElements = useSlidesStore((state) => state.activeElements)();
  const setGridLineSize = useMainStore((store) => store.setGridLineSize);

  // 从 useClipboard 中获取复制、粘贴、剪切和删除元素的相关操作函数
  const { pasteElement, copyElement, cutElement, deleteElement } =
    useClipboard();
  // 从 useCombineElement 中获取组合和取消组合元素的操作函数
  const { combineElements, uncombineElements } = useCombineElement();
  const { lockElement } = useLockElement();
  // 判断是否选择了多个元素
  const isMultiSelect = activeElementIds.length > 1;

  // 定义右键菜单元素列表，根据选择的元素情况进行筛选
  const CONTEXTMENU_Ele = [
    {
      key: 'copy',
      label: '复制',
    },
    {
      key: 'cut',
      label: '剪切',
    },
    {
      key: 'delete',
      label: '删除',
    },
    {
      key: 'lock',
      label: '锁定',
    },
    {
      key: handleElement?.groupId ? 'uncombine' : 'combine',
      label: handleElement?.groupId ? '取消组合' : '组合',
      hide: !isMultiSelect,
    },
  ].filter((item) => !item.hide);

  // 定义右键菜单在空白处的列表
  const CONTEXTMENU_Blank = [
    {
      key: 'paste',
      label: '粘贴',
    },
    {
      key: 'showRuler',
      label: '标尺',
    },
    {
      key: 'network',
      label: '网格线',
      children: [
        {
          key: 'noneRuler',
          label: '无',
        },
        {
          key: 'smallRuler',
          label: '小',
        },
        {
          key: 'middleRuler',
          label: '中',
        },
        {
          key: 'largeRuler',
          label: '大',
        },
      ],
    },
  ];

  // 根据是否有激活元素，选择显示不同的菜单列表
  const menuItems: MenuProps['items'] = activeElementIds.length
    ? CONTEXTMENU_Ele
    : CONTEXTMENU_Blank;

  // 右键菜单点击事件处理函数集合
  const contextMenuClickFn = {
    // 复制元素的处理函数
    copy: function () {
      // 调用复制文本函数，并处理结果或错误
      copyElement();
    },
    // 粘贴元素的处理函数
    paste: function () {
      pasteElement();
    },
    // 删除元素的处理函数
    delete: function () {
      deleteElement();
    },
    // 剪切元素的处理函数
    cut: function () {
      // 获取激活元素信息并转换为 PPTElement 数组
      const activeElementsInfo: PPTElement[] = activeElements;
      // 将元素信息转换为 JSON 字符串
      const text = JSON.stringify({
        type: 'elements',
        data: activeElementsInfo,
      });
      // 调用剪切元素函数并传递元素信息
      cutElement(text);
    },
    // 组合元素的处理函数
    combine: function () {
      combineElements();
    },
    // 取消组合元素的处理函数
    uncombine: function () {
      uncombineElements();
    },
    lock: () => {
      lockElement();
    },
    showRuler: () => {
      setShowRuler(!showRuler);
    },
    noneRuler: () => {
      setGridLineSize(0);
    },
    smallRuler: () => {
      setGridLineSize(25);
    },
    middleRuler: () => {
      setGridLineSize(50);
    },
    largeRuler: () => {
      setGridLineSize(100);
    },
  };

  return {
    menuItems,
    contextMenuClickFn,
  };
};

interface UseHandleClickProps {
  canvasRef: any;
  viewportRef: any;
}

/**
 * useHandleClick 自定义 Hook
 * 用于处理点击事件，包括点击空白区域、双击空白区域和插入自定义形状等操作
 * @param props 包含 canvasRef 和 viewportRef 的属性对象
 * @returns 包含点击事件处理函数的对象
 */
export const useHandleClick = (props: UseHandleClickProps) => {
  const { canvasRef, viewportRef } = props;
  // 从 useMainStore 中获取激活元素的 ID 数组
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  // 从 useKeyboardStore 中获取空格键的状态
  const spaceKeyState = useKeyboardStore((store) => store.spaceKeyState);
  // 从 useViewportSize 中获取拖动画布视口的操作函数
  const { dragViewport, viewportStyles } = useViewportSize(canvasRef);
  // 从 useMainStore 中获取创建元素的状态
  const creatingElement = useMainStore((store) => store.creatingElement);
  const editorAreaFocus = useMainStore((store) => store.editorAreaFocus);
  const textFormatPainter = useMainStore((store) => store.textFormatPainter);
  const setEditorareaFocus = useMainStore((store) => store.setEditorareaFocus);
  const setThumbnailsFocus = useMainStore((store) => store.setThumbnailsFocus);
  const thumbnailsFocus = useMainStore((store) => store.thumbnailsFocus);
  const setTextFormatPainter = useMainStore(
    (store) => store.setTextFormatPainter,
  );
  const setActiveElementIds = useMainStore(
    (store) => store.setActiveElementIds,
  );
  // 从 useMainStore 中获取创建自定义形状的状态
  const creatingCustomShape = useMainStore(
    (store) => store.creatingCustomShape,
  );

  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const elements = currentSlide?.elements;
  const {
    updateMouseSelection,
    mouseSelection,
    mouseSelectionVisible,
    mouseSelectionQuadrant,
  } = useMouseSelection(elements, viewportRef);

  // 从 useMainStore 中获取画布缩放比例
  const canvasScale = useMainStore((store) => store.canvasScale);

  // 从 useCreateElement 中获取创建文本元素和形状元素的操作函数
  const { createTextElement, createShapeElement } = useCreateElement();

  // 处理点击画布空白区域的函数
  const handleClickBlankArea = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // 若点击了右键菜单按钮，则不进行操作
    if (document.querySelector('#contextMenuID')?.contains(e.target as Node))
      return;
    // 若有激活元素，清空激活元素 ID 数组
    if (activeElementIds.length) {
      setActiveElementIds([]);
    }
    // 若空格键未按下，不进行操作
    if (!spaceKeyState) {
      updateMouseSelection(e);
    } else {
      // 拖动画布视口
      dragViewport(e);
    }

    if (!editorAreaFocus) setEditorareaFocus(true);
    if (thumbnailsFocus) setThumbnailsFocus(false);
    if (textFormatPainter) setTextFormatPainter(null);

    // 移除所有选区
    removeAllRanges();
  };

  // 处理双击空白区域的函数，用于插入文本元素
  const handleDblClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 若有激活元素、正在创建元素或正在创建自定义形状，则不进行操作
    if (activeElementIds.length || creatingElement || creatingCustomShape)
      return;
    if (!viewportRef.current) return;

    // 获取视口的边界矩形
    const viewportRect = viewportRef.current.getBoundingClientRect();
    // 计算相对于视口缩放后的位置
    const left = (e.pageX - viewportRect.x) / canvasScale;
    const top = (e.pageY - viewportRect.y) / canvasScale;

    // 创建文本元素
    createTextElement({
      left,
      top,
      width: 200 / canvasScale, // 除以 canvasScale 是为了与点击选区创建的形式保持相同的宽度
      height: 0,
    });
  };

  // 从 useInsertFromCreateSelection 中获取格式化创建选区的操作函数
  const { formatCreateSelection } = useInsertFromCreateSelection(viewportRef);

  // 从 useMainStore 中获取设置创建自定义形状状态的操作函数
  const setCreatingCustomShapeState = useMainStore(
    (state) => state.setCreatingCustomShapeState,
  );

  // 插入自定义任意多边形的函数
  const handleInsertCustomShape = (data: CreateCustomShapeData) => {
    const { start, end, path, viewBox } = data;
    // 格式化创建选区
    const position = formatCreateSelection({ start, end });
    if (position) {
      const supplement: Partial<PPTShapeElement> = {};
      // 补充形状元素的填充属性
      if (data.fill) supplement.fill = data.fill;
      // 补充形状元素的轮廓属性
      if (data.outline) supplement.outline = data.outline;
      // 创建形状元素
      createShapeElement(position, { path, viewBox }, supplement);
    }
    // 设置创建自定义形状状态为 false
    setCreatingCustomShapeState(false);
  };

  return {
    handleClickBlankArea,
    handleDblClick,
    handleInsertCustomShape,
    viewportStyles,
    mouseSelection,
    mouseSelectionVisible,
    mouseSelectionQuadrant,
  };
};
