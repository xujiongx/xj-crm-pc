import { PPTElement } from '@/pages/MotionVideo/interface';
import { isSupportFont } from '@/pages/MotionVideo/utils/font';
import {
  defaultRichTextAttrs,
  type TextAttrs,
} from '@/pages/MotionVideo/utils/prosemirror/utils';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { SYS_FONTS } from '../../../config/font';

import {
  CreatingElement,
  ShapeFormatPainter,
  TextFormatPainter,
} from '@/pages/MotionVideo/types/edit';
import useSlidesStore from './slides';

type State = {
  /** 画布缩放比例（基于宽度1000px） */
  canvasScale: number;
  /** 画布被拖拽移动 */
  canvasDragged: boolean;
  /** 画布可视区域百分比 */
  canvasPercentage: number;
  /** 可视区域比例，默认16:9 */
  viewportRatio: number;
  /** 正在进行元素缩放 */
  isScaling: boolean;
  /** 被选中的元素ID集合，包含 handleElementId */
  activeElementIds: Array<string>;
  /** 正在操作的元素ID */
  activeElementId: string; // 正在操作的元素ID
  disableHotkeys: boolean; // 禁用快捷键
  richTextAttrs: TextAttrs; // 富文本状态
  textFormatPainter: TextFormatPainter | null; // 文字格式刷
  availableFonts: typeof SYS_FONTS; // 当前环境可用字体
  creatingElement: CreatingElement | null;
  editorAreaFocus: boolean; //  编辑区域聚焦
  hiddenElementIdList: string[];
  clipingImageElementId: string;
  activeActionId: string;
  activeConfigTab: string;
  isEditorHsaChange: boolean; // 编辑器数据是否发生变更
  videoData: any;
  creatingCustomShape: boolean;
  shapeFormatPainter: ShapeFormatPainter | null;
  activeGroupElementId: string;
  showRuler: boolean; // 显示标尺
  showTimeline: boolean; // 显示标尺
  gridLineSize: number;
  thumbnailsFocus: boolean;
  isOpenCaption: boolean;
};

type Actions = {
  setCanvasScale: (scale: number) => void;
  setCanvasPercentage: (percentage: number) => void;
  setCanvasDragged: (isDragged: boolean) => void;
  setScalingState: (isScaling: boolean) => void;
  setActiveElementIds: (activeElementIds: string[]) => void;
  setActiveElementId: (activeElementId: string) => void;
  setDisableHotkeysState: (isDisableHotKey: boolean) => void;
  setRichtextAttrs: (attrs: TextAttrs) => void;
  setTextFormatPainter: (textFormatPainter: TextFormatPainter | null) => void;
  setAvailableFonts: () => void;
  setCreatingElement: (element: CreatingElement | null) => void;
  setEditorareaFocus: (isFocus: boolean) => void;
  setViewportRatio: (isFocus: number) => void;
  setHiddenElementIdList: (hiddenElementIdList: string[]) => void;
  activeElementList: () => PPTElement[];
  handleElement: () => PPTElement | null;
  setClipingImageElementId: (elId: string) => void;
  clean: () => void;
  setActiveActionId: (elId: string) => void;
  setActiveConfigTab: (elId: string) => void;
  setIsEditorHsaChange: (isEditorHsaChange: boolean) => void;
  setVideoData: (videoData: any) => void;
  setCreatingCustomShapeState: (state: boolean) => void;
  setShapeFormatPainter: (
    shapeFormatPainter: ShapeFormatPainter | null,
  ) => void;
  setActiveGroupElementId: (activeGroupElementId: string) => void;
  setShowRuler: (showRuler: boolean) => void;
  setShowTimeline: (showTimeline: boolean) => void;
  setGridLineSize: (gridLineSize: number) => void;
  setThumbnailsFocus: (thumbnailsFocus: boolean) => void;
  setIsOpenCaption: (isOpenCaption: boolean) => void;
};

const defaultMainData = {
  canvasScale: 1,
  canvasDragged: false,
  canvasPercentage: 90,
  viewportRatio: 0.5625,
  // viewportRatio: 16 / 9,
  isScaling: false,
  activeElementIds: [],
  activeElementId: '',
  richTextAttrs: defaultRichTextAttrs,
  disableHotkeys: false,
  textFormatPainter: null,
  availableFonts: SYS_FONTS, // 当前环境可用字体
  creatingElement: null, // 正在插入的元素信息，需要通过绘制插入的元素（文字、形状、线条）
  editorAreaFocus: false,
  hiddenElementIdList: [],
  clipingImageElementId: '', // 当前正在裁剪的图片ID
  activeActionId: '',
  activeConfigTab: '',
  isEditorHsaChange: false,
  videoData: undefined,
  creatingCustomShape: false, // 正在绘制任意多边形
  shapeFormatPainter: null, // 形状格式刷
  activeGroupElementId: '', // 组合元素成员中，被选中可独立操作的元素ID
  showRuler: false,
  showTimeline: true,
  gridLineSize: 0, // 网格线尺寸（0表示不显示网格线）
  thumbnailsFocus: false, // 左侧导航缩略图区域聚焦
  isOpenCaption: false, // 是否打开字幕
};

export type MainStoreType = UseBoundStore<StoreApi<State & Actions>>;

const useMainStore = create<State & Actions>((set, get) => ({
  ...defaultMainData,
  clean: () => {
    set(() => defaultMainData);
  },
  activeElementList: () => {
    const currentSlide = useSlidesStore.getState().currentSlide();
    if (!currentSlide || !currentSlide.elements) return [];
    return currentSlide.elements.filter((element) =>
      get().activeElementIds.includes(element.id),
    );
  },
  handleElement: () => {
    const currentSlide = useSlidesStore.getState().currentSlide();
    if (!currentSlide || !currentSlide.elements) return null;
    return (
      currentSlide.elements.filter(
        (element) => get().activeElementId === element.id,
      )[0] || {}
    );
  },
  setCanvasScale: (scale: number) => set(() => ({ canvasScale: scale })),
  setCanvasPercentage: (percentage: number) =>
    set(() => ({ canvasPercentage: percentage })),
  setCanvasDragged: (isDragged: boolean) =>
    set(() => ({ canvasDragged: isDragged })),
  setScalingState: (isScaling: boolean) => set(() => ({ isScaling })),
  setActiveElementIds: (activeElementIds: string[]) => {
    set(() => {
      let activeElementId = '';
      if (activeElementIds.length === 1) {
        activeElementId = activeElementIds[0];
      }
      return {
        activeElementIds,
        activeElementId,
      };
    });
  },
  setActiveElementId: (activeElementId: string) =>
    set(() => ({ activeElementId })),
  setDisableHotkeysState: (disableHotkeys: boolean) =>
    set(() => ({ disableHotkeys })),
  setRichtextAttrs: (attrs: TextAttrs) => set(() => ({ richTextAttrs: attrs })),
  setTextFormatPainter: (textFormatPainter) =>
    set(() => ({ textFormatPainter })),
  setAvailableFonts: () =>
    set(() => ({
      availableFonts: SYS_FONTS.filter((font) => isSupportFont(font.value)),
    })),
  setCreatingElement: (element: CreatingElement | null) =>
    set(() => ({ creatingElement: element })),
  setEditorareaFocus: (isFocus: boolean) =>
    set(() => ({ editorAreaFocus: isFocus })),
  setHiddenElementIdList: (hiddenElementIdList: string[]) =>
    set(() => ({ hiddenElementIdList: hiddenElementIdList })),

  setViewportRatio: (viewportRatio) => {
    set(() => ({
      viewportRatio,
    }));
  },

  setClipingImageElementId(elId: string) {
    set(() => ({
      clipingImageElementId: elId,
    }));
  },
  setActiveActionId: (activeActionId) => {
    set(() => ({
      activeActionId,
    }));
  },
  setActiveConfigTab: (activeConfigTab) => {
    set(() => ({
      activeConfigTab,
    }));
  },
  setIsEditorHsaChange: (isEditorHsaChange) => {
    set(() => ({
      isEditorHsaChange,
    }));
  },
  setVideoData: (videoData) => {
    set(() => ({
      videoData,
    }));
  },
  setCreatingCustomShapeState: (state: boolean) =>
    set(() => ({ creatingCustomShape: state })),

  setShapeFormatPainter: (shapeFormatPainter: ShapeFormatPainter | null) => {
    set(() => ({ shapeFormatPainter }));
  },
  setActiveGroupElementId: (activeGroupElementId: string) => {
    set(() => ({ activeGroupElementId }));
  },
  setShowRuler: (showRuler: boolean) => {
    set(() => ({ showRuler }));
  },

  setGridLineSize: (gridLineSize) => {
    set(() => ({
      gridLineSize,
    }));
  },
  setShowTimeline: (showTimeline: boolean) => {
    set(() => ({ showTimeline }));
  },

  setThumbnailsFocus: (thumbnailsFocus: boolean) => {
    set(() => ({ thumbnailsFocus }));
  },

  setIsOpenCaption: (isOpenCaption: boolean) => {
    set(() => ({ isOpenCaption }));
  },
}));

export default useMainStore;
