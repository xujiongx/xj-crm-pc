import { BaseElementType, ElementType } from '@aicc/designer/src/interface';

export const enum CustomerElementTypes {
  COURSE_APPLY = 'course_apply',
  LIVE_APPLY = 'live_apply',
  PROGRAM_APPLY = 'program_apply',
  MOMENT_APPLY = 'moment_apply',
  PARTNER_APPLY = 'partner_apply',
  TEXT_APPLY = 'text_apply',
  VIDEO_APPLY = 'video_apply',
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
