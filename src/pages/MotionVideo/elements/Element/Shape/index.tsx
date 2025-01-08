import useHistorySnapshot, {
  HistorySnapshot,
} from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { KeyboardStore } from '@/pages/MotionVideo/components/PPTEditor/store/keyboard';
import { MainStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/main';
import { SlidesStoreType } from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import { ContextmenuItem } from '@/pages/MotionVideo/components/PPTEditor/types/types';
import { PPTShapeElement, ShapeText } from '@/pages/MotionVideo/interface';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import ProsemirrorEditor from '../../common/Element/ProsemirrorEditor';
import useElementFlip from '../../hooks/useElementFlip';
import useElementOutline from '../../hooks/useElementOutline';
import useElementShadow from '../../hooks/useElementShadow';
import GradientDefs from './GradientDefs';
import styles from './index.less';

interface ShapeElementProps {
  element: PPTShapeElement;
  onSelect: (
    e: React.MouseEvent | React.TouchEvent,
    element: PPTShapeElement,
    canMove?: boolean,
  ) => void;
  contextmenus: () => ContextmenuItem[] | null;
  store: {
    useMainStore: MainStoreType;
    useSlidesStore: SlidesStoreType;
    useKeyboardStore: KeyboardStore;
    useHistorySnapshot: HistorySnapshot;
  };
}

const ShapeElement = ({
  element,
  onSelect,
  contextmenus,
  store,
}: ShapeElementProps) => {
  const { useMainStore, useSlidesStore } = store;
  const updateElement = useSlidesStore((store) => store.updateElement);
  const removeElementProps = useSlidesStore(
    (store) => store.removeElementProps,
  );
  const handleElementId = useMainStore((store) => store.handleElement()?.id);
  const shapeFormatPainter = useMainStore((store) => store.shapeFormatPainter);
  const setShapeFormatPainter = useMainStore(
    (store) => store.setShapeFormatPainter,
  );

  const { addHistorySnapshot } = useHistorySnapshot();

  const handleSelectElement = (
    e: React.MouseEvent | React.TouchEvent,
    canMove = true,
  ) => {
    e.stopPropagation();
    onSelect(e, element, canMove);
  };

  const execFormatPainter = () => {
    if (!shapeFormatPainter) return;
    const { keep, ...newProps } = shapeFormatPainter;

    updateElement({
      id: element.id,
      props: newProps,
    });

    addHistorySnapshot();
    if (!keep) setShapeFormatPainter(null);
  };

  const outline = element.outline;
  const { outlineWidth, outlineColor, strokeDashArray } =
    useElementOutline(outline);

  const shadow = element.shadow;
  const { shadowStyle } = useElementShadow(shadow);

  const flipH = element.flipH;
  const flipV = element.flipV;
  const { flipStyle } = useElementFlip(flipH, flipV);

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (handleElementId !== element.id) {
      if (editable) setEditable(false);
    }
  }, [handleElementId, element.id, editable]);

  const text: ShapeText = {
    content: element.text?.content || '',
    defaultFontName: element.text?.defaultFontName || '微软雅黑',
    defaultColor: element.text?.defaultColor || '#000',
    align: element.text?.align || 'middle',
  };

  const updateText = (content: string) => {
    const _text = { ...text, content };
    updateElement({
      id: element.id,
      props: { text: _text },
    });

    addHistorySnapshot();
  };

  const checkEmptyText = () => {
    if (!element.text) return;

    const pureText = element.text.content.replace(/<[^>]+>/g, '');
    if (!pureText) {
      removeElementProps({ id: element.id, propName: 'text' });
      addHistorySnapshot();
    }
  };

  const prosemirrorEditorRef = useRef<InstanceType<typeof ProsemirrorEditor>>();
  const startEdit = () => {
    setEditable(true);
    if (prosemirrorEditorRef.current) {
      prosemirrorEditorRef.current.focus();
    }
  };

  return (
    <div
      className={clsx({
        [styles['editable-element-shape']]: true,
        [styles['lock']]: element.lock,
        [styles['format-painter']]: shapeFormatPainter,
      })}
      style={{
        top: `${element.top}px`,
        left: `${element.left}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          style={{
            opacity: element.opacity,
            filter: shadowStyle ? `drop-shadow(${shadowStyle})` : '',
            transform: flipStyle,
            color: text.defaultColor,
            fontFamily: text.defaultFontName,
          }}
          onContextMenu={contextmenus}
          onMouseDown={(e) => handleSelectElement(e)}
          onMouseUp={execFormatPainter}
          onTouchStart={(e) => handleSelectElement(e)}
          onDoubleClick={startEdit}
        >
          <svg overflow="visible" width={element.width} height={element.height}>
            {element.gradient && (
              <defs>
                <GradientDefs
                  id={`editabel-gradient-${element.id}`}
                  type={element.gradient.type}
                  colors={element.gradient.colors}
                  rotate={element.gradient.rotate}
                />
              </defs>
            )}
            <g
              transform={`scale(${element.width / element.viewBox[0]}, ${element.height / element.viewBox[1]}) translate(0,0) matrix(1,0,0,1,0,0)`}
            >
              <path
                className={styles['shape-path']}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="butt"
                strokeMiterlimit="8"
                d={element.path}
                fill={
                  element.gradient
                    ? `url(#editabel-gradient-${element.id})`
                    : element.fill
                }
                stroke={outlineColor}
                strokeWidth={outlineWidth}
                strokeDasharray={strokeDashArray}
              />
            </g>
          </svg>

          <div
            className={clsx(styles['shape-text'], styles[text.align], {
              [styles['editable']]: editable || text.content,
            })}
          >
            {editable || text.content ? (
              <ProsemirrorEditor
                ref={prosemirrorEditorRef}
                elementId={element.id}
                defaultColor={text.defaultColor}
                defaultFontName={text.defaultFontName}
                editable={!element.lock}
                value={text.content}
                hanldeUpdate={(value) => updateText(value)}
                onBlur={checkEmptyText}
                onMouseDown={(e) => handleSelectElement(e, false)}
                store={store}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeElement;
