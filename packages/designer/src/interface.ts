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
 * 自定义配置
 */
export interface CustomerConfig {
  materials: any;
  elementsMap: any;
  configsMap: any;
  uploadConfig: any;
  hidePageStyle?: boolean;
}

/**
 * 页面配置
 * 页面样式信息
 * 页面拓展信息
 */
export interface ViewConfig {
  style: React.CSSProperties;
  pageConfig?: {
    id: string;
    title: string;
  };
}
