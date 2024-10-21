import CarouselElement from '../elements/Carousel/Element';
import ImageElement from '../elements/Image/Element';
import NavigationElement from '../elements/Navigation/Element';
import TitleElement from '../elements/Title/Element';
import { ElementTypes } from '../interface';

export const ElementTypeMap: Record<string, any> = {
  [ElementTypes.IMAGE]: ImageElement,
  [ElementTypes.CAROUSEL]: CarouselElement,
  [ElementTypes.NAVIGATION]: NavigationElement,
  [ElementTypes.TITLE]: TitleElement,
};
