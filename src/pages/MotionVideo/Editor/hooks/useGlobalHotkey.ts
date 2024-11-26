import { useEventListener, useKeyPress } from 'ahooks';
import useKeyboardStore from '../store/keyboard';
import useHistorySnapshot from './useHistorySnapshot';

const useGlobalHotkey = () => {
  const { redo, undo } = useHistorySnapshot();

  const clearKey = () => {
    const { setCtrlKeyState, setShiftKeyState, setSpaceKeyState } =
      useKeyboardStore.getState();
    setCtrlKeyState(false);
    setShiftKeyState(false);
    setSpaceKeyState(false);
  };

  useEventListener('keyup', clearKey, { target: document });
  useEventListener('blur', clearKey);

  useKeyPress(['ctrl', 'meta'], () => {
    useKeyboardStore.getState().setCtrlKeyState(true);
  });

  useKeyPress(['shift'], () => {
    useKeyboardStore.getState().setShiftKeyState(true);
  });

  useKeyPress(['space'], () => {
    useKeyboardStore.getState().setSpaceKeyState(true);
  });

  useKeyPress(['ctrl.v', 'meta.v'], () => {
    console.log('粘贴');
  });

  useKeyPress(['ctrl.a', 'meta.a'], () => {
    console.log('全选');
  });

  useKeyPress(['ctrl.z', 'meta.z'], undo);
  useKeyPress(['ctrl.y', 'meta.y'], redo);
  useKeyPress(['delete', 'backspace'], () => {
    console.log('删除');
  });
};

export default useGlobalHotkey;
