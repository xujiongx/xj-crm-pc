import { KEYS } from '@/pages/MotionVideo/config/hotkey';
import { ElementOrderCommands } from '@/pages/MotionVideo/types/edit';
import { useEffect } from 'react';
import { useKeyboardStore, useMainStore, useSlidesStore } from '../store';
import useClipboard from './useClipboard';
import useCombineElement from './useCombineElement';
import useCreateElement from './useCreateElement';
import useHistorySnapshot from './useHistorySnapshot';
import useLockElement from './useLockElement';
import useMoveElement from './useMoveElement';
import useOrderElement from './useOrderElement';
import useScaleCanvas from './useScaleCanvas';
import useScreening from './useScreening';
import useSelectElements from './useSelectElement';
import useSlideHandler from './useSlideHandler';
import { VIEWPORT_SIZE } from './useViewportSize';

const HotkeyHandler = () => {
  const { combineElements, uncombineElements } = useCombineElement();
  const {
    pasteElement,
    copyElement,
    cutElement,
    deleteElement,
    quickCopyElement,
  } = useClipboard();
  const { lockElement } = useLockElement();

  const activeElementList = useMainStore((store) => store.activeElementList());
  const thumbnailsFocus = useMainStore((store) => store.thumbnailsFocus);
  const handleElement = useMainStore((store) => store.handleElement());
  const disableHotkeys = useMainStore((store) => store.disableHotkeys);
  const editorAreaFocus = useMainStore((store) => store.editorAreaFocus);
  const setActiveElementIds = useMainStore(
    (store) => store.setActiveElementIds,
  );
  const activeElementId = useMainStore((store) => store.activeElementId);
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );
  const viewportRatio = useMainStore((store) => store.viewportRatio);
  const {
    ctrlKeyState,
    setCtrlKeyState,
    setShiftKeyState,
    setSpaceKeyState,
    shiftKeyState,
    spaceKeyState,
  } = useKeyboardStore((store) => store);

  const {
    updateSlideIndex,
    copySlide,
    cutSlide,
    copyAndPasteSlide,
    deleteSlide,
    createSlide,
    pasteSlide,
    selectAllSlide,
  } = useSlideHandler();

  const { createTextElement, createShapeElement } = useCreateElement();

  // const { selectAllElements } = useSelectElement();
  const { moveElement } = useMoveElement();
  const { orderElement } = useOrderElement();
  const { redo, undo } = useHistorySnapshot();
  const { enterScreening, enterScreeningFromStart } = useScreening();
  const { scale: scaleCanvas, reset: resetCanvas } = useScaleCanvas();

  const { selectAllElements } = useSelectElements();

  const copy = () => {
    if (activeElementList.length) {
      copyElement();
    } else if (thumbnailsFocus) {
      copySlide();
    }
  };
  const paste = () => {
    if (thumbnailsFocus) {
      pasteSlide();
    } else {
      pasteElement();
    }
  };

  const cut = () => {
    if (activeElementList.length) {
      cutElement();
    } else if (thumbnailsFocus) {
      cutSlide();
    }
  };

  const quickCopy = () => {
    if (activeElementList.length) {
      quickCopyElement();
    } else if (thumbnailsFocus) {
      copyAndPasteSlide();
    }
  };

  const selectAll = () => {
    if (editorAreaFocus) {
      selectAllElements();
    }
    if (thumbnailsFocus) {
      selectAllSlide();
    }
  };

  const lock = () => {
    if (!editorAreaFocus) return;
    lockElement();
  };

  const combine = () => {
    if (!editorAreaFocus) return;
    combineElements();
  };

  const uncombine = () => {
    if (!editorAreaFocus) return;
    uncombineElements();
  };

  const remove = () => {
    if (activeElementList.length) {
      deleteElement();
    } else if (thumbnailsFocus) {
      deleteSlide();
    }
  };

  const move = (key: string) => {
    if (activeElementList.length) {
      moveElement(key);
    } else if (key === KEYS.UP || key === KEYS.DOWN) {
      updateSlideIndex(key);
    }
  };

  const moveSlide = (key: string) => {
    if (key === KEYS.PAGEUP) {
      updateSlideIndex(KEYS.UP);
    } else if (key === KEYS.PAGEDOWN) {
      updateSlideIndex(KEYS.DOWN);
    }
  };

  const order = (command: ElementOrderCommands) => {
    if (!handleElement) return;
    orderElement(handleElement, command);
  };

  const create = () => {
    if (!thumbnailsFocus) return;
    createSlide();
  };

  const tabActiveElement = () => {
    if (!currentSlide.elements.length) return;
    if (!activeElementId) {
      const firstElement = currentSlide.elements[0];
      setActiveElementIds([firstElement.id]);
      return;
    }
    const currentIndex = currentSlide.elements.findIndex(
      (el) => el.id === activeElementId,
    );
    const nextIndex =
      currentIndex >= currentSlide.elements.length - 1 ? 0 : currentIndex + 1;
    const nextElementId = currentSlide.elements[nextIndex].id;

    setActiveElementIds([nextElementId]);
  };

  const keydownListener = (e: KeyboardEvent) => {
    const { metaKey, ctrlKey, shiftKey, altKey } = e;

    const ctrlOrMetaKeyActive = ctrlKey || metaKey;

    const key = e.key.toUpperCase();

    if (ctrlOrMetaKeyActive && !ctrlKeyState) {
      setCtrlKeyState(true);
    }
    if (shiftKey && !shiftKeyState) {
      setShiftKeyState(true);
    }
    if (!disableHotkeys && key === KEYS.SPACE) {
      setSpaceKeyState(true);
    }

    if (shiftKey && key === KEYS.F5) {
      e.preventDefault();
      enterScreening();
      setShiftKeyState(false);
      return;
    }
    if (key === KEYS.F5) {
      e.preventDefault();
      enterScreeningFromStart();
      return;
    }

    if (!editorAreaFocus && !thumbnailsFocus) return;

    // 确保上全局键盘操作，不然会影响组件的键盘事件
    if (e.target.tagName !== 'BODY') return;

    if (ctrlOrMetaKeyActive && key === KEYS.C) {
      if (disableHotkeys) return;
      e.preventDefault();
      copy();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.V) {
      if (disableHotkeys) return;
      e.preventDefault();
      paste();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.X) {
      if (disableHotkeys) return;
      e.preventDefault();
      cut();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.D) {
      if (disableHotkeys) return;
      e.preventDefault();
      quickCopy();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Z) {
      if (disableHotkeys) return;
      e.preventDefault();
      undo();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.Y) {
      if (disableHotkeys) return;
      e.preventDefault();
      redo();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.A) {
      if (disableHotkeys) return;
      e.preventDefault();
      selectAll();
    }
    if (ctrlOrMetaKeyActive && key === KEYS.L) {
      if (disableHotkeys) return;
      e.preventDefault();
      lock();
    }
    if (!shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys) return;
      e.preventDefault();
      combine();
    }
    if (shiftKey && ctrlOrMetaKeyActive && key === KEYS.G) {
      if (disableHotkeys) return;
      e.preventDefault();
      uncombine();
    }

    if (altKey && key === KEYS.F) {
      if (disableHotkeys) return;
      e.preventDefault();
      order(ElementOrderCommands.TOP);
    }
    if (altKey && key === KEYS.B) {
      if (disableHotkeys) return;
      e.preventDefault();
      order(ElementOrderCommands.BOTTOM);
    }
    if (key === KEYS.DELETE || key === KEYS.BACKSPACE) {
      if (disableHotkeys) return;

      e.preventDefault();
      remove();
    }
    if (key === KEYS.UP) {
      if (disableHotkeys) return;
      e.preventDefault();
      move(KEYS.UP);
    }
    if (key === KEYS.DOWN) {
      if (disableHotkeys) return;
      e.preventDefault();
      move(KEYS.DOWN);
    }
    if (key === KEYS.LEFT) {
      if (disableHotkeys) return;
      e.preventDefault();
      move(KEYS.LEFT);
    }
    if (key === KEYS.RIGHT) {
      if (disableHotkeys) return;
      e.preventDefault();
      move(KEYS.RIGHT);
    }
    if (key === KEYS.PAGEUP) {
      if (disableHotkeys) return;
      e.preventDefault();
      moveSlide(KEYS.PAGEUP);
    }
    if (key === KEYS.PAGEDOWN) {
      if (disableHotkeys) return;
      e.preventDefault();
      moveSlide(KEYS.PAGEDOWN);
    }
    if (key === KEYS.ENTER) {
      if (disableHotkeys) return;
      e.preventDefault();
      create();
    }
    if (key === KEYS.MINUS) {
      if (disableHotkeys) return;
      e.preventDefault();
      scaleCanvas('-');
    }
    if (key === KEYS.EQUAL) {
      if (disableHotkeys) return;
      e.preventDefault();
      scaleCanvas('+');
    }
    if (key === KEYS.DIGIT_0) {
      if (disableHotkeys) return;
      e.preventDefault();
      resetCanvas();
    }
    if (key === KEYS.TAB) {
      if (disableHotkeys) return;
      e.preventDefault();
      tabActiveElement();
    }

    if (
      editorAreaFocus &&
      !shiftKey &&
      !ctrlOrMetaKeyActive &&
      !disableHotkeys
    ) {
      if (key === KEYS.T) {
        createTextElement(
          {
            width: 120,
            height: 0,
          },
          { content: 'ext' },
        );
      } else if (key === KEYS.R) {
        createShapeElement(
          {
            left: (VIEWPORT_SIZE - 200) / 2,
            top: (VIEWPORT_SIZE * viewportRatio - 200) / 2,
            width: 200,
            height: 200,
          },
          { viewBox: [200, 200], path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z' },
        );
      } else if (key === KEYS.O) {
        createShapeElement(
          {
            left: (VIEWPORT_SIZE - 200) / 2,
            top: (VIEWPORT_SIZE * viewportRatio - 200) / 2,
            width: 200,
            height: 200,
          },
          {
            viewBox: [200, 200],
            path: 'M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z',
          },
        );
      }
    }
  };

  const keyupListener = () => {
    if (ctrlKeyState) {
      setCtrlKeyState(false);
    }
    if (shiftKeyState) {
      setShiftKeyState(false);
    }
    if (spaceKeyState) {
      setSpaceKeyState(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keydownListener);
    document.addEventListener('keyup', keyupListener);
    window.addEventListener('blur', keyupListener);

    return () => {
      document.removeEventListener('keydown', keydownListener);
      document.removeEventListener('keyup', keyupListener);
      window.removeEventListener('blur', keyupListener);
    };
  }, [
    ctrlKeyState,
    shiftKeyState,
    spaceKeyState,
    editorAreaFocus,
    disableHotkeys,
    thumbnailsFocus,
    scaleCanvas,
    resetCanvas,
  ]);

  return null;
};

export default HotkeyHandler;
