export interface ViewConfig {
  style: React.CSSProperties;
  pageConfig?: {
    id: string;
    title: string;
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

export interface BaseElementType {
  id: string;
  'decorator-props'?: {
    template: 'full' | 'card';
    style?: React.CSSProperties;
    title?: TitleConfig;
  };
}

export interface ImageElementType extends BaseElementType {
  component: string;
  'component-props': {
    images?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
    }>;
  };
}

export interface CarouselElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    height?: string;
    images?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
    }>;
  };
}

export interface NavigationElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    count?: number;
    sections?: Array<{
      linkStyle?: 'column' | 'link';
      column?: string;
      link?: string;
      imgUrl?: string;
      title?: string;
      color?: string;
    }>;
  };
}

export interface ApplyElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    type?: 'list' | 'image' | 'card' | 'title';
    showInfo?: boolean;
    showNumber?: boolean;
    showCount?: number;
    hideInEmpty?: boolean;
    data?: Array<ApplyItemType>;
  };
}

export interface ApplyItemType {
  cover?: string;
  title?: string;
  deadline?: string;
  new?: boolean;
  status?: number;
  progress?: number;
  pv?: number;
}

export type ElementType =
  | ImageElementType
  | CarouselElementType
  | NavigationElementType
  | ApplyElementType;

export interface TitleElementType extends BaseElementType {
  component: 'title';
  'component-props'?: TitleConfig;
}
