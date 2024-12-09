import { create } from 'zustand';
import { SYS_FONTS } from '../config/font';
import { PPTElement } from '../interface';
import { CreatingElement, TextFormatPainter } from '../types/edit';
import { isSupportFont } from '../utils/font';
import {
  defaultRichTextAttrs,
  type TextAttrs,
} from '../utils/prosemirror/utils';
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
  setAvailableFonts: (availableFonts: typeof SYS_FONTS) => void;
  setCreatingElement: (element: CreatingElement | null) => void;
  setEditorareaFocus: (isFocus: boolean) => void;
  setViewportRatio: (isFocus: number) => void;
  setHiddenElementIdList: (hiddenElementIdList: string[]) => void;
  activeElementList: () => PPTElement[];
  handleElement: () => PPTElement | null;
  setClipingImageElementId: (elId: string) => void;
};

const useMainStore = create<State & Actions>((set, get) => ({
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
      currentSlide.elements.find(
        (element) => get().activeElementId === element.id,
      ) || null
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
}));

export default useMainStore;
