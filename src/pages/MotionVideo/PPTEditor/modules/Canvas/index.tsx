import { MenuProps } from 'antd';
import { useRef } from 'react';
import useClipboard from '../../hooks/useClipboard';
import useDragElement from '../../hooks/useDragElement';
import useRotateElement from '../../hooks/useRotateElement';
import useScaleElement from '../../hooks/useScaleElement';
import useSelectElement from '../../hooks/useSelectElement';
import useViewportSize from '../../hooks/useViewportSize';
import { AlignmentLineProps, PPTElement } from '../../interface';
import useKeyboardStore from '../../store/keyboard';
import useMainStore from '../../store/main';
import useSlidesStore from '../../store/slides';
import { removeAllRanges } from '../../utils/selection';
import ContextMenu from './components/ContextMenu';
import DragMask from './components/DragMask';
import EditableElement from './components/EditableElement';
import Operate from './components/Operate';
import ViewportBackground from './components/ViewportBackground';
import styles from './index.less';

const Canvas = (props) => {
  const { viewportWrapperStyle } = props;
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const alignmentLinesRef = useRef<AlignmentLineProps[]>([]);
  const viewportwrapperRef = useRef<HTMLDivElement>(null);

  const canvasScale = useMainStore((store) => store.canvasScale);
  const activeElementIds = useMainStore((store) => store.activeElementIds);
  const activeElementId = useMainStore((store) => store.activeElementId);
  const spaceKeyState = useKeyboardStore((store) => store.spaceKeyState);
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const activeElements = useSlidesStore((state) => state.activeElements);

  const { dragViewport, viewportStyles } = useViewportSize(canvasRef);

  const { pasteElement, copyText, cutElement, deleteElement } = useClipboard();

  const { drag } = useDragElement(
    currentSlide()?.elements,
    alignmentLinesRef.current,
  );
  const { select } = useSelectElement(currentSlide()?.elements, drag);
  const { scale } = useScaleElement(
    currentSlide()?.elements,
    alignmentLinesRef.current,
    canvasScale,
  );
  const { rotate } = useRotateElement(
    currentSlide()?.elements,
    viewportRef,
    canvasScale,
  );

  // 点击画布的空白区域：清空焦点元素、清除文字选区
  const clickBlankArea = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击右键菜单的按钮，保持原元素焦点
    if (document.querySelector('#contextMenuID')?.contains(e.target as Node))
      return;
    if (activeElementIds.length) {
      useMainStore.getState().setActiveElementIds([]);
    }
    if (!spaceKeyState) {
    } else {
      dragViewport(e);
    }
    removeAllRanges();
  };

  //  viewport-wrapper 右键菜单
  const CONTEXTMENU_Blank = [
    {
      key: 'paste',
      label: '粘贴',
    },
  ];

  const CONTEXTMENU_Ele = [
    {
      key: 'copy',
      label: '复制',
    },
    {
      key: 'cut',
      label: '剪切',
    },
    {
      key: 'delete',
      label: '删除',
    },
  ];
  const viewportWrapperContextMenu: MenuProps['items'] = activeElementIds.length
    ? CONTEXTMENU_Ele
    : CONTEXTMENU_Blank;

  const contextMenuClickFn = {
    copy: function () {
      const activeElementsInfo: PPTElement[] = activeElements();
      const text = JSON.stringify({
        type: 'elements',
        data: activeElementsInfo,
      });
      copyText(text)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    paste: function () {
      pasteElement();
    },
    delete: function () {
      deleteElement();
    },
    cut: function () {
      const activeElementsInfo: PPTElement[] = activeElements();
      const text = JSON.stringify({
        type: 'elements',
        data: activeElementsInfo,
      });
      cutElement(text);
    },
  };

  return (
    <>
      <div
        className={styles.canvas}
        ref={canvasRef}
        onMouseDown={(e) => clickBlankArea(e)}
      >
        <div
          ref={viewportwrapperRef}
          id={'viewport-wrapper'}
          className={styles['viewport-wrapper']}
          style={{
            width: viewportStyles.width * canvasScale + 'px',
            height: viewportStyles.height * canvasScale + 'px',
            left: viewportStyles.left + 'px',
            top: viewportStyles.top + 'px',
            ...viewportWrapperStyle,
          }}
        >
          <div className={styles.operate}>
            {currentSlide()?.elements?.map((element) => (
              <Operate
                key={element.id}
                element={element}
                isSelected={activeElementIds.includes(element.id)}
                isActive={activeElementId === element.id}
                onScale={scale}
                onRotate={rotate}
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
            {currentSlide()?.elements?.map((element, index) => (
              <EditableElement
                key={element.id}
                element={element}
                zIndex={index + 1}
                onSelect={select}
              />
            ))}
          </div>
          <ContextMenu
            MenuItem={viewportWrapperContextMenu}
            targetEl={viewportwrapperRef.current as HTMLDivElement}
            contextMenuClickFn={contextMenuClickFn}
          ></ContextMenu>
        </div>

        <DragMask />
      </div>
    </>
  );
};

export default Canvas;
