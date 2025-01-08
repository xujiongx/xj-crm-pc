import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import ImageView from '@/pages/MotionVideo/elements/Element/Image/view';
import ShapeView from '@/pages/MotionVideo/elements/Element/Shape/view';
import TextView from '@/pages/MotionVideo/elements/Element/Text/view';
import VideoView from '@/pages/MotionVideo/elements/Element/VideoElement/view';
import {
  ElementTypes,
  PPTElement,
  SlideItem,
} from '@/pages/MotionVideo/interface';

interface ViewElement {
  zIndex: number;
  element: PPTElement;
  slide: SlideItem;
}

const ElementTypeMap: Record<string, ({ element }: any) => JSX.Element> = {
  [ElementTypes.TEXT]: TextView,
  [ElementTypes.IMAGE]: ImageView,
  [ElementTypes.VIDEO]: VideoView,
  [ElementTypes.SHAPE]: ShapeView,
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

  if (!Component) return null;

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
