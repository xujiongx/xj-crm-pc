import {
  ElementTypes,
  PPTElement,
} from '@/pages/MotionVideo/PPTEditor/interface';
import ImageView from '../../../Element/Image/view';
import TextView from '../../../Element/Text/view';
import VideoView from '../../../Element/VideoElement/view';

interface ViewElement {
  zIndex: number;
  element: PPTElement;
}

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextView,
  [ElementTypes.IMAGE]: ImageView,
  [ElementTypes.VIDEO]: VideoView,
};

const ScreenElement = ({ element, zIndex }: ViewElement) => {
  const Component = ElementTypeMap[element.type];

  return (
    <div id={`view-element-${element.id}`} style={{ zIndex }}>
      <Component element={element as never} />
    </div>
  );
};

export default ScreenElement;
