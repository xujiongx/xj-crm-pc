import { ElementTypes } from '../../interface';
import DigitalRobotView from './DigitalRobot/view'
import ImageView from './Image/view';
import LineElement from './Line/view';
import ShapeView from './Shape/view';
import TextView from './Text/view';
import VideoView from './VideoElement/view';

export const ElementViewTypeMap: Record<
  string,
  ({ element }: any) => JSX.Element | null
> = {
  [ElementTypes.TEXT]: TextView,
  [ElementTypes.IMAGE]: ImageView,
  [ElementTypes.VIDEO]: VideoView,
  [ElementTypes.SHAPE]: ShapeView,
  [ElementTypes.LINE]: LineElement,
  [ElementTypes.DIGITAL_ROBOT]: DigitalRobotView,
  [ElementTypes.AUDIO]: () => null,
};
