export const enum ElementTypes {
  IMAGE = 'image',
  CAROUSEL = 'carousel',
  NAVIGATION = 'navigation',
  // COURSE_APPLY = 'course_apply',
  // LIVE_APPLY = 'live_apply',
  // PROGRAM_APPLY = 'program_apply',
  // MOMENT_APPLY = 'moment_apply',
  // PARTNER_APPLY = 'partner_apply',
  // TEXT_APPLY = 'text_apply',
  // VIDEO_APPLY = 'video_apply',
  TITLE = 'title',
  DEMO = 'demo',
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
  title: string;
  icon?: string | React.ReactNode;
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
export interface DemoElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    title?: string;
  };
}

export interface TitleElementType extends BaseElementType {
  component: 'title';
  'component-props'?: TitleConfig;
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

export type ElementType =
  | ImageElementType
  | CarouselElementType
  | NavigationElementType;

export interface ViewConfig {
  style: React.CSSProperties;
  pageConfig?: {
    id: string;
    title: string;
  };
}
