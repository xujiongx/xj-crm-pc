import { ElementTypes, PPTElement } from '@/pages/MotionVideo/Editor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/Editor/store';
import ImageElement from '../../../../components/Element/Image';
import TextElement from '../../../../components/Element/Text';
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
    curElementAnimations[0].type === 'in' &&
    curElementAnimations[0].effect === 'show';

  return (
    <div
      className={styles.element}
      id={`element-${element.id}`}
      style={{ zIndex, visibility: show ? 'visible' : 'hidden' }}
    >
      <Component element={element as never} onSelect={onSelect} />
    </div>
  );
};

export default EditableElement;
