import { CarouselConfigRender } from '@aicc/designer/es/elements/Carousel';
import { ImageConfigRender } from '@aicc/designer/es/elements/Image';
import { NavigationConfigRender } from '@aicc/designer/es/elements/Navigation';
import { TitleConfigRender } from '@aicc/designer/es/elements/Title';
import { ElementTypes } from '@aicc/designer/es/interface';
import { CourseConfigRender } from '../elements/Course';
import { DemoConfigRender } from '../elements/Demo';
import { CustomerElementTypes } from '../interface';

export const ConfigTypeMap: Record<
  ElementTypes & CustomerElementTypes,
  {
    component: () => React.ReactNode;
    config?: { hideTitle?: boolean; hideStyle?: boolean };
  }
> = {
  [ElementTypes.IMAGE]: {
    component: ImageConfigRender,
    config: {
      // hideStyle: true,
    },
  },
  [ElementTypes.CAROUSEL]: {
    component: CarouselConfigRender,
    config: {
      hideTitle: true,
    },
  },
  [ElementTypes.NAVIGATION]: {
    component: NavigationConfigRender,
  },
  [ElementTypes.TITLE]: {
    component: TitleConfigRender,
  },
  [CustomerElementTypes.DEMO]: {
    component: DemoConfigRender,
  },
  [CustomerElementTypes.COURSE_APPLY]: {
    component: CourseConfigRender,
  },
};
