import VideoElement from '@/pages/MotionVideo/PPTEditor/modules/Canvas/components/EditableElement/Element/VideoElement';
import {
  ElementTypes,
  PPTElement,
} from '@/pages/MotionVideo/PPTEditor/interface';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/PPTEditor/store';
import ImageElement from './Element/Image';
import TextElement from './Element/Text';
import styles from './index.less';

interface EditableElementProps {
  zIndex: number;
  element: PPTElement;
  onSelect: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    element: PPTElement,
    canMove?: boolean,
  ) => void;
}

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextElement,
  [ElementTypes.IMAGE]: ImageElement,
  [ElementTypes.VIDEO]: VideoElement,
};

const EditableElement = ({
  element,
  zIndex,
  onSelect,
}: EditableElementProps) => {
  const Component = ElementTypeMap[element.type];

  const currentSlideAnimations = useSlidesStore
    .getState()
    .currentSlideAnimations();

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
      className={styles.element}
      id={`element-${element.id}`}
      style={{
        zIndex,
        visibility: show ? 'visible' : 'hidden',
        display: isHidden ? 'none' : '',
      }}
    >
      <Component element={element as never} onSelect={onSelect} />
    </div>
  );
};

export default EditableElement;
