import {
  useKeyboardStore,
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { PPTElement } from '@/pages/MotionVideo/interface';
import useHistorySnapshot from '../../../../hooks/useHistorySnapshot';

import { ElementTypeMap } from '@/pages/MotionVideo/elements/Element';
import { useLayoutEffect } from 'react';
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

const EditableElement = ({
  element,
  zIndex,
  onSelect,
}: EditableElementProps) => {
  const Component = ElementTypeMap[element.type];

  const currentSlideAnimations = useSlidesStore(
    (store) => store.currentSlideAnimations,
  )();

  const curElementAnimations = currentSlideAnimations.filter(
    (item) => item.elId === element.id,
  );

  // 入场动画为一直显示，默认渲染就为true
  const show =
    curElementAnimations[0]?.type === 'in' &&
    curElementAnimations[0]?.effect === 'show';

  const hiddenElementIdList = useMainStore(
    (store) => store.hiddenElementIdList,
  );

  const isHidden = hiddenElementIdList.includes(element.id);

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(`item-${elementId}`);
    if (element) {
      element.scrollIntoView({ block: 'start' });
    }
  };

  useLayoutEffect(() => {
    const elRef = document.querySelector(
      `#element-${element.id} [class^=editable-element-]`,
    ) as HTMLElement;
    if (elRef) {
      elRef.style.visibility = show ? 'visible' : 'hidden';
    }
  }, []);

  return (
    <div
      className={styles.element}
      id={`element-${element.id}`}
      style={{
        zIndex,
        opacity: isHidden ? '0' : '1',
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
    >
      <Component
        element={element as never}
        onSelect={(
          e: React.MouseEvent<HTMLDivElement, MouseEvent>,
          element: PPTElement,
          canMove: boolean,
        ) => {
          onSelect(e, element, canMove);
          scrollToElement(element.id);
        }}
        store={{
          useMainStore,
          useSlidesStore,
          useKeyboardStore,
          useHistorySnapshot,
        }}
      />
    </div>
  );
};

export default EditableElement;
