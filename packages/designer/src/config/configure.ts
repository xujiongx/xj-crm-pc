import { CarouselConfigRender } from '../elements/Carousel';
import { ImageConfigRender } from '../elements/Image';
import { NavigationConfigRender } from '../elements/Navigation';
import { TitleConfigRender } from '../elements/Title';
import { ElementTypes } from '../interface';

export const ConfigTypeMap: Record<
  ElementTypes,
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
};
