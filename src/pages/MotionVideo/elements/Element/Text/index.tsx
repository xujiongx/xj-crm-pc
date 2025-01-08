import { HistorySnapshot } from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import { PPTTextElement } from '@/pages/MotionVideo/interface';
import { useLatest } from 'ahooks';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import ElementOutline from '../../common/Element/ElementOutline';
import { computeShadowStyle } from '../../utils';
import styles from './index.less';
import ProsemirrorEditor from '../../common/Element/ProsemirrorEditor';

interface TextElementProps {
  element: PPTTextElement;
  onSelect: (
    e: MouseEvent | TouchEvent,
    element: PPTTextElement,
    canMove?: boolean,
  ) => void;
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useHistorySnapshot: HistorySnapshot;
  };
}

const TextElement = ({ element, onSelect, store }: TextElementProps) => {
  const { useMainStore, useSlidesStore, useHistorySnapshot } = store;

  const elementRef = useRef<HTMLDivElement>(null);
  // 监听文本元素的尺寸变化
  // 如果高度变化时正处在缩放操作中，则等待缩放操作结束后再更新
  const realHeightCacheRef = useRef(-1);
  const realWidthCacheRef = useRef(-1);

  const isScaling = useMainStore((store) => store.isScaling);
  const activeElementId = useMainStore((store) => store.activeElementId);
  const updateElement = useSlidesStore((store) => store.updateElement);
  const isScalingRef = useLatest(isScaling);

  const {  addHistorySnapshot } = useHistorySnapshot();

  const updateContent = (content: string) => {
    updateElement({
      id: element.id,
      props: { content },
    });
    addHistorySnapshot();
  };

  useEffect(() => {
    if (activeElementId !== element.id) return;
    if (!isScaling) {
      if (!element.vertical && realHeightCacheRef.current !== -1) {
        updateElement({
          id: element.id,
          props: { height: realHeightCacheRef.current },
        });
        realHeightCacheRef.current = -1;
      }
      if (element.vertical && realWidthCacheRef.current !== -1) {
        updateElement({
          id: element.id,
          props: { width: realWidthCacheRef.current },
        });
        realWidthCacheRef.current = -1;
      }
    }
  }, [isScaling]);

  const updateTextElementHeight = (entries: ResizeObserverEntry[]) => {
    const contentRect = entries[0].contentRect;
    if (!elementRef.current) return;

    const realHeight = contentRect.height + 20;
    const realWidth = contentRect.width + 20;
    if (!element.vertical && element.height !== realHeight) {
      if (!isScalingRef.current) {
        updateElement({
          id: element.id,
          props: { height: realHeight },
        });
      } else realHeightCacheRef.current = realHeight;
    }
    if (element.vertical && element.width !== realWidth) {
      if (!isScalingRef.current) {
        updateElement({
          id: element.id,
          props: { width: realWidth },
        });
      } else realWidthCacheRef.current = realWidth;
    }
  };

  const resizeObserver = new ResizeObserver(updateTextElementHeight);

  useEffect(() => {
    if (elementRef.current) resizeObserver.observe(elementRef.current);
    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    };
  }, [element?.height, element?.width]);

  const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
    e.stopPropagation();
    onSelect(e, element, canMove);
  };

  return (
    <div
      className={styles['editable-element-text']}
      style={{
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          ref={elementRef}
          onMouseDown={(event) =>
            handleSelectElement(event as unknown as MouseEvent)
          }
          onTouchStart={(event) =>
            handleSelectElement(event as unknown as MouseEvent)
          }
          style={{
            width: element.vertical ? 'auto' : element.width + 'px',
            height: element.vertical ? element.height + 'px' : 'auto',
            backgroundColor: element.fill,
            opacity: element.opacity,
            textShadow: computeShadowStyle(element.shadow),
            lineHeight: element.lineHeight,
            letterSpacing: (element.wordSpace || 0) + 'px',
            color: element.defaultColor,
            fontFamily: element.defaultFontName,
            writingMode: element.vertical ? 'vertical-rl' : 'horizontal-tb',
          }}
        >
          <ElementOutline
            width={element.width}
            height={element.height}
            outline={element.outline}
          />
          <ProsemirrorEditor
            elementId={element.id}
            defaultColor={element.defaultColor as string}
            defaultFontName={element.defaultFontName as string}
            editable={!element.lock}
            value={element.content}
            autoFocus={true}
            style={{
              '--paragraphSpace': `${
                element.paragraphSpace === undefined
                  ? 5
                  : element.paragraphSpace
              }px`,
            }}
            hanldeUpdate={(value: string) => updateContent(value)}
            onMouseDown={($event) =>
              handleSelectElement($event as unknown as MouseEvent, false)
            }
            store={store}
          />
          <div className={clsx(styles['drag-handler'], styles['top'])}></div>
          <div className={clsx(styles['drag-handler'], styles['bottom'])}></div>
        </div>
      </div>
    </div>
  );
};

export default TextElement;
