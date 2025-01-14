import { ElementTypes } from '../../interface';
import DigitalRobot from './DigitalRobot';
import ImageElement from './Image';
import LineElement from './Line';
import ShapeElement from './Shape';
import TextElement from './Text';
import VideoElement from './VideoElement';

export const ElementTypeMap: Record<
  string,
  ({ element, onSelect, store }: any) => JSX.Element | null
> = {
  [ElementTypes.TEXT]: TextElement,
  [ElementTypes.IMAGE]: ImageElement,
  [ElementTypes.VIDEO]: VideoElement,
  [ElementTypes.SHAPE]: ShapeElement,
  [ElementTypes.LINE]: LineElement,
  [ElementTypes.DIGITAL_ROBOT]: DigitalRobot,
  [ElementTypes.AUDIO]: () => null,
};
