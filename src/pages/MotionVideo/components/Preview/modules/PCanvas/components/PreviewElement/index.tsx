import { ElementViewTypeMap } from '@/pages/MotionVideo/elements/Element/view';
import styles from './index.less';

const PreviewElement = (props) => {
  const { element, zIndex, animations, isHidden } = props;

  const Component = ElementViewTypeMap[element.type];

  // 入场动画为一直显示，默认渲染就为true
  const show = animations[0]?.type === 'in' && animations[0]?.effect === 'show';

  return (
    <div
      className={styles.element}
      id={`element-${element.id}`}
      style={{
        zIndex,
        visibility: show ? 'visible' : 'hidden',
        opacity: isHidden ? '0' : '1',
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
    >
      <Component element={element as never} isHidden={isHidden} />
    </div>
  );
};

export default PreviewElement;
