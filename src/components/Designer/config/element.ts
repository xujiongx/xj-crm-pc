import { CarouselElementRender } from '@aicc/designer/es/elements/Carousel';
import { ImageElementRender } from '@aicc/designer/es/elements/Image';
import { NavigationElementRender } from '@aicc/designer/es/elements/Navigation';
import { TitleElementRender } from '@aicc/designer/es/elements/Title';
import { ElementTypes } from '@aicc/designer/es/interface';
import { CourseElementRender } from '../elements/Course';
import { DemoElementRender } from '../elements/Demo';
import { CustomerElementTypes } from '../interface';

export const ElementTypeMap: Record<string, any> = {
  [ElementTypes.IMAGE]: ImageElementRender,
  [ElementTypes.CAROUSEL]: CarouselElementRender,
  [ElementTypes.NAVIGATION]: NavigationElementRender,
  [ElementTypes.TITLE]: TitleElementRender,
  [CustomerElementTypes.DEMO]: DemoElementRender,
  [CustomerElementTypes.COURSE_APPLY]: CourseElementRender,
};
