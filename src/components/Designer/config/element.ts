import { CarouselElementRender } from '@/components/Decoration/elements/Carousel';
import { ImageElementRender } from '@/components/Decoration/elements/Image';
import { NavigationElementRender } from '@/components/Decoration/elements/Navigation';
import { TitleElementRender } from '@/components/Decoration/elements/Title';
import { ElementTypes } from '@/components/Decoration/interface';
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
