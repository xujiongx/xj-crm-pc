import { ElementViewTypeMap } from '@/pages/MotionVideo/elements/Element/view';
import {
  PPTAnimation,
  PPTElement,
  SlideItem,
} from '@/pages/MotionVideo/interface';
import styles from './index.less';

interface ViewElement {
  zIndex: number;
  element: PPTElement;
  slide: SlideItem;
  animations: PPTAnimation[];
  isHidden: boolean;
}

const ScreenElement = (props: ViewElement) => {
  const { element, zIndex, animations, isHidden } = props;

  const Component = ElementViewTypeMap[element.type];

  const show = animations[0]?.type === 'in' && animations[0]?.effect === 'show';

  if (!Component) return null;

  return (
    <div
      className={styles.element}
      id={`view-element-${element.id}`}
      style={{
        zIndex,
        // visibility: show ? 'visible' : 'hidden',// 为什么会影响到线条的箭头,换成透明度方案
        opacity: show && !isHidden ? '1' : '0',
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
    >
      <Component element={element as never} />
    </div>
  );
};

export default ScreenElement;
