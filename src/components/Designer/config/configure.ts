import { CarouselConfigRender } from '@/components/Decoration/elements/Carousel';
import { ImageConfigRender } from '@/components/Decoration/elements/Image';
import { NavigationConfigRender } from '@/components/Decoration/elements/Navigation';
import { TitleConfigRender } from '@/components/Decoration/elements/Title';
import { ElementTypes } from '@/components/Decoration/interface';
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
