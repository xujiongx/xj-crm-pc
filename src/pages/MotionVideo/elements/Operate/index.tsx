import { ElementTypes } from '../../interface';
import CommonElementOperate from './CommonElementOperate';
import ImageElementOperate from './Image';
import LineElementOperate from './Line';
import ShapeElementOperate from './Shape';
import TextElementOperate from './Text';

export const ElementOperateTypeMap: Record<string, any> = {
  [ElementTypes.TEXT]: TextElementOperate,
  [ElementTypes.IMAGE]: ImageElementOperate,
  [ElementTypes.VIDEO]: CommonElementOperate,
  [ElementTypes.SHAPE]: ShapeElementOperate,
  [ElementTypes.LINE]: LineElementOperate,
  [ElementTypes.DIGITAL_ROBOT]: CommonElementOperate,
  [ElementTypes.AUDIO]: null,
};
