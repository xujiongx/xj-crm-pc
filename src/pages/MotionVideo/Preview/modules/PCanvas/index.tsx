import { SLIDE_ANIMATIONS } from '@/pages/MotionVideo/PPTEditor/config';
import { VIEWPORT_SIZE } from '@/pages/MotionVideo/PPTEditor/hooks/useViewportSize';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
import useSlideSize from '../../hooks/useSlideSize';
import Scene from './components/Scene';
import styles from './index.less';

const PCanvas = (props) => {
  const { curIndex } = props;
  const { slides, hiddenElementIdList } = JSON.parse(
    localStorage.getItem('PPTEditorData') || '{}',
  );
  const slideListWrapRef = useRef<HTMLDivElement>(null);

  const { slideWidth, slideHeight } = useSlideSize(slideListWrapRef);
  const scale = slideWidth / VIEWPORT_SIZE;

  console.log('😌', slideWidth, slideHeight);

  const slidesWithTurningMode = useMemo(() => {
    return slides.map((slide) => {
      let turningMode = slide.turningMode;
      if (!turningMode) turningMode = 'slideY';
      if (turningMode === 'random') {
        const turningModeKeys = SLIDE_ANIMATIONS.filter(
          (item) => !['random', 'no'].includes(item.value),
        ).map((item) => item.value);
        turningMode =
          turningModeKeys[Math.floor(Math.random() * turningModeKeys.length)];
      }
      return {
        ...slide,
        turningMode,
      };
    });
  }, []);

  return (
    <div className={styles['screen-slide-list']} ref={slideListWrapRef}>
      {slidesWithTurningMode.map((item, index) => (
        <div
          key={item.id}
          className={clsx({
            [styles['slide-item']]: true,
            [styles[`turning-mode-${item.turningMode}`]]: true,
            [styles['current']]: index === curIndex,
            [styles['before']]: index < curIndex,
            [styles['after']]: index > curIndex,
            [styles['hide']]:
              (index === curIndex - 1 || index === curIndex + 1) &&
              item.turningMode !== slidesWithTurningMode[curIndex].turningMode,
          })}
        >
          {(Math.abs(curIndex - index) < 2 || item.animations?.length) && (
            <div
              className={styles['slide-content']}
              style={{
                width: `${slideWidth}px`,
                height: `${slideHeight}px`,
              }}
            >
              <Scene
                item={item}
                scale={scale}
                hiddenElementIdList={hiddenElementIdList}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PCanvas;
