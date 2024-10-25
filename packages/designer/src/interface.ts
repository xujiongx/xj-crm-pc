import { CSSProperties } from 'react';
import { CarouselElementType } from './elements/Carousel';
import { ImageElementType } from './elements/Image';
import { NavigationElementType } from './elements/Navigation';

export const enum ElementTypes {
  IMAGE = 'image',
  CAROUSEL = 'carousel',
  NAVIGATION = 'navigation',
  TITLE = 'title',
}

export interface BaseElementType {
  id: string;
  title?: string;
  icon?: string;
  'decorator-props'?: {
    template: 'full' | 'card';
    style?: React.CSSProperties;
    title?: TitleConfig;
  };
}

export interface TitleConfig {
  visible?: boolean;
  title?: string;
  fontSize?: string;
  fontWeight?: boolean;
  color?: string;
  iconColor?: string;
  icon?: string;
  more?: string;
  moreLinkStyle?: 'column' | 'link';
  moreLink?: string;
  moreColumn?: string;
  showMoreIcon?: boolean;
  align?: 'left' | 'center';
}

export type ElementType =
  | ImageElementType
  | CarouselElementType
  | NavigationElementType;

/**
 * 定义一个 ViewConfig 接口，用于描述视图的配置
 *
 * @interface ViewConfig
 * @property {React.CSSProperties} style - 样式配置
 * @property {Object} pageConfig - 页面配置
 * @property {string} [pageConfig.id] - 页面ID
 * @property {string} [pageConfig.title] - 页面标题
 */
export interface ViewConfig {
  // 样式属性，用于定义视图的 CSS 样式
  style: React.CSSProperties;
  // 页面配置对象，包含页面的 ID 和标题
  pageConfig?: {
    // 页面的唯一标识符，可选属性
    id?: string;
    // 页面的标题，可选属性
    title?: string;
  };
}

/**
 * 定义一个 CustomerConfig 接口，用于描述客户的自定义配置
 *
 * @interface CustomerConfig
 * @property {any} materials - 物料配置
 * @property {any} elementsMap - 元素映射配置
 * @property {any} configsMap - 配置映射
 * @property {any} uploadConfig - 上传配置
 * @property {boolean} [hidePageStyle] - 是否隐藏页面样式
 * @property {CSSProperties} [layoutStyles] - 布局样式
 * @property {null | (() => JSX.Element)} [headerRender] - 头部渲染函数
 * @property {{ label: string; value: string }[]} [linkOptions] - 链接选项
 */
export interface CustomerConfig {
  materials: {
    title: string;
    items: any[];
  }[];
  elementsMap: Record<string, any>;
  configsMap: Record<
    string,
    {
      component: () => React.ReactNode;
      config?: { hideTitle?: boolean; hideStyle?: boolean };
    }
  >;
  uploadConfig: {
    headers: any;
    action: string;
  };
  hidePageStyle?: boolean;
  layoutStyles?: CSSProperties;
  headerRender?: null | (() => JSX.Element);
  linkOptions?: { label: string; value: string }[];
}
