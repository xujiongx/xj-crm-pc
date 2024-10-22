import { CarouselElementRender } from '../elements/Carousel';
import { ImageElementRender } from '../elements/Image';
import { NavigationElementRender } from '../elements/Navigation';
import { TitleElementRender } from '../elements/Title';
import { ElementTypes } from '../interface';

export const ElementTypeMap: Record<string, any> = {
  [ElementTypes.IMAGE]: ImageElementRender,
  [ElementTypes.CAROUSEL]: CarouselElementRender,
  [ElementTypes.NAVIGATION]: NavigationElementRender,
  [ElementTypes.TITLE]: TitleElementRender,
};
