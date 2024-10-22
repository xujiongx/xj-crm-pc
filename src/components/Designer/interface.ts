import { BaseElementType, ElementType } from '../Decoration/interface';

export const enum CustomerElementTypes {
  DEMO = 'demo',
  NAVIGATION = 'navigation',
  COURSE_APPLY = 'course_apply',
}

export interface DemoElementType extends BaseElementType {
  component: string;
  'component-props'?: {
    title?: string;
  };
}

export type CustomerElementType = ElementType | DemoElementType;

export interface ViewConfig {
  style: React.CSSProperties;
  pageConfig?: {
    id: string;
    title: string;
  };
}
