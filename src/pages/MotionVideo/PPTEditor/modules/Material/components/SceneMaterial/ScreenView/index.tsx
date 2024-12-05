import useBackgroundStyle from '../../../../../hooks/useBackgroundStyle';
import { VIEWPORT_SIZE } from '../../../../../hooks/useViewportSize';
import { SlideItem } from '../../../../../interface';
import ScreenElement from './components/ScreenElement';
import styles from './index.less';

interface ViewProps {
  slide: SlideItem;
  scale: number;
  ratio: number;
}

const ScreenView = ({ slide, scale, ratio }: ViewProps) => {
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
        <ScreenElement key={element.id} element={element} zIndex={index + 1} />
      ))}
    </div>
  );
};

export default ScreenView;
