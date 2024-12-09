import { ImageElementClip, ImageElementFilters } from "./types/slides"

export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

export interface CreateElementSelectionData {
  start: [number, number];
  end: [number, number];
}

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export const enum OperateBorderLines {
  T = 'top',
  B = 'bottom',
  L = 'left',
  R = 'right',
}

export const enum OperateResizeHandlers {
  LEFT_TOP = 'left-top',
  TOP = 'top',
  RIGHT_TOP = 'right-top',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_BOTTOM = 'left-bottom',
  BOTTOM = 'bottom',
  RIGHT_BOTTOM = 'right-bottom',
}

export interface AlignmentLineAxis {
  x: number;
  y: number;
}

export interface AlignmentLineProps {
  type: 'vertical' | 'horizontal';
  axis: AlignmentLineAxis;
  length: number;
}

export interface AlignLine {
  value: number;
  range: [number, number];
}

/** 元素通用属性 */
interface PPTBaseElement {
  /** 元素ID */
  id: string;
  /** 元素水平方向位置（距离画布左侧） */
  left: number;
  /** 元素垂直方向位置（距离画布顶部） */
  top: number;
  /** 锁定元素 */
  lock?: boolean;
  /** 组合ID（拥有相同组合ID的元素即为同一组合元素成员） */
  groupId?: string;
  /** 元素宽度 */
  width: number;
  /** 元素高度 */
  height: number;
  /** 旋转角度 */
  rotate: number;
  /** 元素名 */
  name?: string;
}

/** 元素边框 */
export interface PPTElementOutline {
  /** 边框样式（实线或虚线） */
  style?: 'dashed' | 'solid' | 'dotted';
  /** 边框宽度 */
  width?: number;
  /** 边框颜色 */
  color?: string;
}

/** 元素阴影 */
export interface PPTElementShadow {
  /** 水平偏移量 */
  h: number;
  /** 垂直偏移量 */
  v: number;
  /** 模糊程度 */
  blur: number;
  /** 阴影颜色 */
  color: string;
}

/** 文本元素 */
export interface PPTTextElement extends PPTBaseElement {
  type: 'text';
  /** content: 文本内容（HTML字符串） */
  content: string;
  /** 默认字体（会被文本内容中的HTML内联样式覆盖） */
  defaultFontName?: string;
  /** 默认颜色（会被文本内容中的HTML内联样式覆盖） */
  defaultColor?: string;
  /** 边框 */
  outline?: PPTElementOutline;
  /** 填充色 */
  fill?: string;
  /** 行高（倍），默认1.5 */
  lineHeight?: number;
  /** 字间距，默认0 */
  wordSpace?: number;
  /** 不透明度，默认1 */
  opacity?: number;
  /** 阴影 */
  shadow?: PPTElementShadow;
  /** 段间距，默认 5px */
  paragraphSpace?: number;
  /** 竖向文本 */
  vertical?: boolean;
}

/** 图片元素 */
export interface PPTImageElement extends PPTBaseElement {
  type: 'image';
  fixedRatio: boolean;
  src: string;
  outline?: PPTElementOutline;
  filters?: ImageElementFilters;
  clip?: ImageElementClip;
  flipH?: boolean;
  flipV?: boolean;
  shadow?: PPTElementShadow;
  radius?: number;
  colorMask?: string;
  opacity?: number;
}

/**
 * 形状渐变
 *
 * type: 渐变类型（径向、线性）
 *
 * color: 渐变颜色
 *
 * rotate: 渐变角度（线性渐变）
 */
export interface ShapeGradient {
  type: 'linear' | 'radial';
  color: [string, string];
  rotate: number;
}

export type ShapeTextAlign = 'top' | 'middle' | 'bottom';

/**
 * 形状内文本
 *
 * content: 文本内容（HTML字符串）
 *
 * defaultFontName: 默认字体（会被文本内容中的HTML内联样式覆盖）
 *
 * defaultColor: 默认颜色（会被文本内容中的HTML内联样式覆盖）
 *
 * align: 文本对齐方向（垂直方向）
 */
export interface ShapeText {
  content: string;
  defaultFontName: string;
  defaultColor: string;
  align: ShapeTextAlign;
}

/**
 * 形状元素
 *
 * type: 元素类型（shape）
 *
 * viewBox: SVG的viewBox属性，例如 [1000, 1000] 表示 '0 0 1000 1000'
 *
 * path: 形状路径，SVG path 的 d 属性
 *
 * fixedRatio: 固定形状宽高比例
 *
 * fill: 填充，不存在渐变时生效
 *
 * gradient?: 渐变，该属性存在时将优先作为填充
 *
 * outline?: 边框
 *
 * opacity?: 不透明度
 *
 * flipH?: 水平翻转
 *
 * flipV?: 垂直翻转
 *
 * shadow?: 阴影
 *
 * special?: 特殊形状（标记一些难以解析的形状，例如路径使用了 L Q C A 以外的类型，该类形状在导出后将变为图片的形式）
 *
 * text?: 形状内文本
 *
 * pathFormula?: 形状路径计算公式
 * 一般情况下，形状的大小变化时仅由宽高基于 viewBox 的缩放比例来调整形状，而 viewBox 本身和 path 不会变化，
 * 但也有一些形状希望能更精确的控制一些关键点的位置，此时就需要提供路径计算公式，通过在缩放时更新 viewBox 并重新计算 path 来重新绘制形状
 *
 * keypoint?: 关键点位置百分比
 */
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape';
  viewBox: [number, number];
  path: string;
  fixedRatio: boolean;
  fill: string;
  gradient?: ShapeGradient;
  outline?: PPTElementOutline;
  opacity?: number;
  flipH?: boolean;
  flipV?: boolean;
  shadow?: PPTElementShadow;
  special?: boolean;
  text?: ShapeText;
  pathFormula?: ShapePathFormulasKeys;
  keypoint?: number;
}

export type LinePoint = '' | 'arrow' | 'dot';

/**
 * 线条元素
 *
 * type: 元素类型（line）
 *
 * start: 起点位置（[x, y]）
 *
 * end: 终点位置（[x, y]）
 *
 * style: 线条样式（实线、虚线）
 *
 * color: 线条颜色
 *
 * points: 端点样式（[起点样式, 终点样式]，可选：无、箭头、圆点）
 *
 * shadow?: 阴影
 *
 * broken?: 折线控制点位置（[x, y]）
 *
 * curve?: 二次曲线控制点位置（[x, y]）
 *
 * cubic?: 三次曲线控制点位置（[[x1, y1], [x2, y2]]）
 */
export interface PPTLineElement
  extends Omit<PPTBaseElement, 'height' | 'rotate'> {
  type: 'line';
  start: [number, number];
  end: [number, number];
  style: 'solid' | 'dashed';
  color: string;
  points: [LinePoint, LinePoint];
  shadow?: PPTElementShadow;
  broken?: [number, number];
  curve?: [number, number];
  cubic?: [[number, number], [number, number]];
}

/**
 * 表格单元格样式
 *
 * bold?: 加粗
 *
 * em?: 斜体
 *
 * underline?: 下划线
 *
 * strikethrough?: 删除线
 *
 * color?: 字体颜色
 *
 * backcolor?: 填充色
 *
 * fontsize?: 字体大小
 *
 * fontname?: 字体
 *
 * align?: 对齐方式
 */
export interface TableCellStyle {
  bold?: boolean;
  em?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  backcolor?: string;
  fontsize?: string;
  fontname?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

/**
 * 表格单元格
 *
 * id: 单元格ID
 *
 * colspan: 合并列数
 *
 * rowspan: 合并行数
 *
 * text: 文字内容
 *
 * style?: 单元格样式
 */
export interface TableCell {
  id: string;
  colspan: number;
  rowspan: number;
  text: string;
  style?: TableCellStyle;
}

/**
 * 表格主题
 *
 * color: 主题色
 *
 * rowHeader: 标题行
 *
 * rowFooter: 汇总行
 *
 * colHeader: 第一列
 *
 * colFooter: 最后一列
 */
export interface TableTheme {
  color: string;
  rowHeader: boolean;
  rowFooter: boolean;
  colHeader: boolean;
  colFooter: boolean;
}

/**
 * 表格元素
 *
 * type: 元素类型（table）
 *
 * outline: 边框
 *
 * theme?: 主题
 *
 * colWidths: 列宽数组，如[30, 50, 20]表示三列宽度分别为30%, 50%, 20%
 *
 * cellMinHeight: 单元格最小高度
 *
 * data: 表格数据
 */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table';
  outline: PPTElementOutline;
  theme?: TableTheme;
  colWidths: number[];
  cellMinHeight: number;
  data: TableCell[][];
}

/**
 * LaTeX元素（公式）
 *
 * type: 元素类型（latex）
 *
 * latex: latex代码
 *
 * path: svg path
 *
 * color: 颜色
 *
 * strokeWidth: 路径宽度
 *
 * viewBox: SVG的viewBox属性
 *
 * fixedRatio: 固定形状宽高比例
 */
export interface PPTLatexElement extends PPTBaseElement {
  type: 'latex';
  latex: string;
  path: string;
  color: string;
  strokeWidth: number;
  viewBox: [number, number];
  fixedRatio: boolean;
}

/**
 * 视频元素
 *
 * type: 元素类型（video）
 *
 * src: 视频地址
 *
 * autoplay: 自动播放
 *
 * poster: 预览封面
 *
 * ext: 视频后缀，当资源链接缺少后缀时用该字段确认资源类型
 */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video';
  src: string;
  autoplay: boolean;
  poster?: string;
  ext?: string;
  duration?: number;
}

/**
 * 音频元素
 *
 * type: 元素类型（audio）
 *
 * fixedRatio: 固定图标宽高比例
 *
 * color: 图标颜色
 *
 * loop: 循环播放
 *
 * autoplay: 自动播放
 *
 * src: 音频地址
 *
 * ext: 音频后缀，当资源链接缺少后缀时用该字段确认资源类型
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio';
  fixedRatio: boolean;
  color: string;
  loop: boolean;
  autoplay: boolean;
  src: string;
  ext?: string;
}

export type PPTElement =
  | PPTTextElement
  | PPTImageElement
  | PPTShapeElement
  | PPTLineElement
  | PPTTableElement
  | PPTLatexElement
  | PPTVideoElement
  | PPTAudioElement;

/** 幻灯片页面 */
export interface SlideItem {
  id: string;
  /** 元素集合 */
  elements: PPTElement[];
  /** 页面背景 */
  background?: SlideBackground;
  /** 元素动画集合 */
  animations?: PPTAnimation[];
  /** 翻页方式 */
  turningMode?: TurningMode;
}

/** 幻灯片背景 */
export interface SlideBackground {
  /** 背景类型（纯色、图片、渐变） */
  type: 'solid' | 'image' | 'gradient';
  /** 背景颜色（纯色） */
  color?: string;
  /** 图片地址（图片） */
  image?: string;
  /** 图片填充方式 */
  imageSize?: 'cover' | 'contain' | 'repeat';
  /** 渐变类型（线性、径向） */
  gradientType?: 'linear' | 'radial';
  /** 渐变颜色 */
  gradientColor?: [string, string];
  /** 渐变角度（线性） */
  gradientRotate?: number;
}

export type AnimationTrigger = 'click' | 'meantime' | 'auto';

export interface PPTAnimation {
  id: string;
  name: string;
  elId: string;
  effect: string;
  type: AnimationType;
  // duration?: number;
  // trigger?: AnimationTrigger;
  start: number;
  end: number;
}

export type TurningMode =
  | 'no'
  | 'fade'
  | 'slideX'
  | 'slideY'
  | 'random'
  | 'slideX3D'
  | 'slideY3D'
  | 'rotate'
  | 'scaleY'
  | 'scaleX'
  | 'scale'
  | 'scaleReverse';

/**
 * 幻灯片主题
 *
 * backgroundColor: 页面背景颜色
 *
 * themeColor: 主题色，用于默认创建的形状颜色等
 *
 * fontColor: 字体颜色
 *
 * fontName: 字体
 */
export interface SlideTheme {
  backgroundColor: string;
  themeColor: string;
  fontColor: string;
  fontName: string;
  outline: PPTElementOutline;
  shadow: PPTElementShadow;
}

export type AnimationType = 'in' | 'out' | 'attention';

/**
 * 图片翻转、形状翻转
 *
 * flipH?: 水平翻转
 *
 * flipV?: 垂直翻转
 */
export interface ImageOrShapeFlip {
  flipH?: boolean;
  flipV?: boolean;
}
