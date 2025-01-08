import { AlignmentLineProps } from '@/pages/MotionVideo/interface';
import { useEffect, useRef } from 'react';
import useDragElement from '../../hooks/useDragElement';
import useMoveShapeKeypoint from '../../hooks/useMoveShapeKeypoint';
import useRotateElement from '../../hooks/useRotateElement';
import useScaleElement from '../../hooks/useScaleElement';
import useMainStore from '../../store/main';
import useSlidesStore from '../../store/slides';
import AlignmentLine from './components/AlignmentLine';
import ContextMenu from './components/ContextMenu';
import DragMask from './components/DragMask';
import EditableElement from './components/EditableElement';
import MouseSelection from './components/MouseSelection';
import MultiSelectOperate from './components/MultiSelectOperate';
import Operate from './components/Operate';
import Ruler from './components/Ruler';
import ShapeCreateCanvas from './components/ShapeCreateCanvas';
import ViewportBackground from './components/ViewportBackground';
import useSelectElement from './hooks/useSelectElement';
import { useHandleClick, useMenu } from './index.hooks';
import styles from './index.less';

const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const alignmentLinesRef = useRef<AlignmentLineProps[]>([]);
  const viewportwrapperRef = useRef<HTMLDivElement>(null);
  const canvasScale = useMainStore((store) => store.canvasScale);
  const creatingCustomShape = useMainStore(
    (store) => store.creatingCustomShape,
  );
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const activeGroupElementId = useMainStore(
    (store) => store.activeGroupElementId,
  );
  const setActiveGroupElementId = useMainStore(
    (store) => store.setActiveGroupElementId,
  );
  const activeElementId = useMainStore((store) => store.activeElementId);
  const elements = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  )?.elements;

  const showRuler = useMainStore((store) => store.showRuler);

  // const { viewportStyles } = useViewportSize(canvasRef);

  const { moveShapeKeypoint } = useMoveShapeKeypoint(elements, canvasScale);

  const { drag } = useDragElement(
    elements,
    (value) => (alignmentLinesRef.current = value),
  );
  const { select } = useSelectElement(elements, drag);
  const { scale, scaleMultiElement } = useScaleElement(
    elements,
    (value) => (alignmentLinesRef.current = value),
    canvasScale,
  );
  const { rotate } = useRotateElement(elements, viewportRef, canvasScale);

  const isMultiSelect = activeElementIds.length > 1;

  const { menuItems, contextMenuClickFn } = useMenu();
  const {
    viewportStyles,
    handleClickBlankArea,
    handleDblClick,
    handleInsertCustomShape,
    mouseSelection,
    mouseSelectionVisible,
    mouseSelectionQuadrant,
  } = useHandleClick({
    viewportRef,
    canvasRef,
  });

  useEffect(() => {
    setActiveGroupElementId('');
  }, [activeElementId]);

  return (
    <>
      <div
        className={styles.canvas}
        ref={canvasRef}
        onMouseDown={(e) => handleClickBlankArea(e)}
        onDoubleClick={(e) => handleDblClick(e)}
      >
        {creatingCustomShape && (
          <ShapeCreateCanvas created={handleInsertCustomShape} />
        )}
        <div
          ref={viewportwrapperRef}
          id={'viewport-wrapper'}
          className={styles['viewport-wrapper']}
          style={{
            width: viewportStyles.width * canvasScale + 'px',
            height: viewportStyles.height * canvasScale + 'px',
            left: viewportStyles.left + 'px',
            top: viewportStyles.top + 'px',
          }}
        >
          <div className={styles.operate}>
            {alignmentLinesRef.current.map((line, index) => (
              <AlignmentLine
                key={index}
                type={line.type}
                axis={line.axis}
                length={line.length}
                canvasScale={canvasScale}
              />
            ))}
            {isMultiSelect && (
              <MultiSelectOperate
                elementList={elements}
                scaleMultiElement={scaleMultiElement}
              />
            )}
            {elements?.map((element) => (
              <Operate
                key={element.id}
                element={element}
                isSelected={activeElementIds.includes(element.id)}
                isActive={activeElementId === element.id}
                onScale={scale}
                onRotate={rotate}
                moveShapeKeypoint={moveShapeKeypoint}
                isMultiSelect={isMultiSelect}
                isActiveGroupElement={activeGroupElementId === element.id}
              />
            ))}
          </div>
          <ViewportBackground />
          <div
            ref={viewportRef}
            className={styles.viewport}
            style={{
              transform: `scale(${canvasScale})`,
            }}
          >
            {mouseSelectionVisible && (
              <MouseSelection
                top={mouseSelection.top}
                left={mouseSelection.left}
                width={mouseSelection.width}
                height={mouseSelection.height}
                quadrant={mouseSelectionQuadrant}
              />
            )}
            {elements?.map((element, index) => (
              <EditableElement
                key={element.id}
                element={element}
                zIndex={index + 1}
                onSelect={select}
              />
            ))}
          </div>
          <ContextMenu
            menuItems={menuItems}
            targetEl={viewportwrapperRef.current as HTMLDivElement}
            contextMenuClickFn={contextMenuClickFn}
          ></ContextMenu>
        </div>

        <DragMask />
        {showRuler && (
          <Ruler viewportStyles={viewportStyles} elementList={elements} />
        )}
      </div>
    </>
  );
};

export default Canvas;
