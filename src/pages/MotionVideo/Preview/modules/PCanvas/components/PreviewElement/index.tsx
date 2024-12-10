import { ElementTypes } from '@/pages/MotionVideo/PPTEditor/interface';
import ImageView from '@/pages/MotionVideo/PPTEditor/modules/Canvas/components/EditableElement/Element/Image/view';
import TextView from '@/pages/MotionVideo/PPTEditor/modules/Canvas/components/EditableElement/Element/Text/view';
import VideoView from '@/pages/MotionVideo/PPTEditor/modules/Canvas/components/EditableElement/Element/VideoElement/view';
import styles from './index.less';

const ElementTypeMap = {
  [ElementTypes.TEXT]: TextView,
  [ElementTypes.IMAGE]: ImageView,
  [ElementTypes.VIDEO]: VideoView,
};

const PreviewElement = (props) => {
  const { element, zIndex, animations, isHidden } = props;

  const Component = ElementTypeMap[element.type];

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
