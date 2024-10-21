import CarouselConfigure from '../elements/Carousel/Configure';
import ImageConfigure from '../elements/Image/Configure';
import NavigationConfigure from '../elements/Navigation/Configure';
import TitleConfigure from '../elements/Title/Configure';
import { ElementTypes } from '../interface';

export const ConfigTypeMap: Record<
  ElementTypes,
  {
    component: () => React.ReactNode;
    config?: { hideTitle?: boolean };
  }
> = {
  [ElementTypes.IMAGE]: {
    component: ImageConfigure,
  },
  [ElementTypes.CAROUSEL]: {
    component: CarouselConfigure,
    config: {
      hideTitle: true,
    },
  },
  [ElementTypes.NAVIGATION]: {
    component: NavigationConfigure,
  },
  [ElementTypes.TITLE]: {
    component: TitleConfigure,
  },
};
