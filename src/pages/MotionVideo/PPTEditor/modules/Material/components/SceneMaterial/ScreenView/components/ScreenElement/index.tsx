import {
  ElementTypes,
  PPTElement,
  SlideItem,
} from '@/pages/MotionVideo/PPTEditor/interface';
import { useMainStore } from '@/pages/MotionVideo/PPTEditor/store';
import ImageView from '../../../../../../Canvas/components/EditableElement/Element/Image/view';
import TextView from '../../../../../../Canvas/components/EditableElement/Element/Text/view';
import VideoView from '../../../../../../Canvas/components/EditableElement/Element/VideoElement/view';

interface ViewElement {
  zIndex: number;
  element: PPTElement;
  slide: SlideItem;
}

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextView,
  [ElementTypes.IMAGE]: ImageView,
  [ElementTypes.VIDEO]: VideoView,
};

const ScreenElement = ({ element, zIndex, slide }: ViewElement) => {
  const Component = ElementTypeMap[element.type];

  const currentSlideAnimations = slide.animations || [];

  const curElementAnimations = currentSlideAnimations.filter(
    (item) => item.elId === element.id,
  );
  const show =
    curElementAnimations[0]?.type === 'in' &&
    curElementAnimations[0]?.effect === 'show';

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  const isHidden = hiddenElementIdList.includes(element.id);

  return (
    <div
      id={`view-element-${element.id}`}
      style={{
        zIndex,
        visibility: show ? 'visible' : 'hidden',
        opacity: isHidden ? '0' : '1',
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
    >
      <Component element={element as never} />
    </div>
  );
};

export default ScreenElement;
