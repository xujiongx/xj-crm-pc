import { CustomerElementTypes } from '@/components/Designer/interface';
import { BaseElementType } from '@aicc/designer/src/interface';

export interface ApplyElementType extends BaseElementType {
  component:
    | CustomerElementTypes.COURSE_APPLY
    | CustomerElementTypes.TEXT_APPLY;
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
