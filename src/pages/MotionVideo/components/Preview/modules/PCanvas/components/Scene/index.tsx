import useSlideBackgroundStyle from '@/pages/MotionVideo/components/PPTEditor/hooks/useSlideBackgroundStyle';
import { VIEWPORT_SIZE } from '@/pages/MotionVideo/components/PPTEditor/hooks/useViewportSize';
import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import PreviewElement from '../PreviewElement';
import styles from './index.less';
const Scene = (props) => {
  const { item, scale, hiddenElementIdList } = props;
  const viewportRatio = useMainStore((store) => store.viewportRatio);

  const { backgroundStyle } = useSlideBackgroundStyle(item.background);

  return (
    <div
      style={{
        width: VIEWPORT_SIZE + 'px',
        height: VIEWPORT_SIZE * viewportRatio + 'px',
        transform: `scale(${scale})`,
      }}
      className={styles['screen-slide']}
    >
      <div
        className={styles['background']}
        style={{ ...backgroundStyle }}
      ></div>
      {item?.elements?.map((element, index) => {
        return (
          <PreviewElement
            key={element.id}
            element={element}
            zIndex={index + 1}
            animations={item?.animations?.filter(
              (item) => item.elId === element.id,
            )}
            isHidden={hiddenElementIdList.includes(element.id)}
          />
        );
      })}
    </div>
  );
};

export default Scene;
