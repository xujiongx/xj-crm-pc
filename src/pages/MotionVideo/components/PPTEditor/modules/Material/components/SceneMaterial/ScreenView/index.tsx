import { SlideItem } from '@/pages/MotionVideo/interface';
import useBackgroundStyle from '../../../../../hooks/useBackgroundStyle';
import { VIEWPORT_SIZE } from '../../../../../hooks/useViewportSize';
import ScreenElement from './components/ScreenElement';
import styles from './index.less';

interface ViewProps {
  slide: SlideItem;
  scale: number;
  ratio: number;
  hiddenElementIdList?: string[];
}

const ScreenView = ({
  slide,
  scale,
  ratio,
  hiddenElementIdList = [],
}: ViewProps) => {
  const { backgroundStyle } = useBackgroundStyle(slide.background);
  return (
    <div
      className={styles['screen-view']}
      style={{
        width: VIEWPORT_SIZE,
        height: VIEWPORT_SIZE * ratio,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div className={styles['background']} style={{ ...backgroundStyle }} />
      {slide.elements.map((element, index) => (
        <ScreenElement
          slide={slide}
          key={element.id}
          element={element}
          zIndex={index + 1}
          animations={
            slide.animations?.filter((item) => item.elId === element.id) || []
          }
          isHidden={hiddenElementIdList.includes(element.id)}
        />
      ))}
    </div>
  );
};

export default ScreenView;
