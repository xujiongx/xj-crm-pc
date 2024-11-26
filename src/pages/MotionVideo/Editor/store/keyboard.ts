import { create } from 'zustand';

type State = {
  ctrlKeyState: boolean;
  shiftKeyState: boolean;
  spaceKeyState: boolean;
};

type Actions = {
  setCtrlKeyState: (active: boolean) => void;
  setShiftKeyState: (active: boolean) => void;
  setSpaceKeyState: (active: boolean) => void;
};

const useKeyboardStore = create<State & Actions>((set, get) => ({
  /** ctrl键按下状态 */
  ctrlKeyState: false,
  /**  shift键按下状态 */
  shiftKeyState: false,
  /** space键按下状态 */
  spaceKeyState: false,
  setCtrlKeyState: (active: boolean) => set(() => ({ ctrlKeyState: active })),
  setShiftKeyState: (active: boolean) => set(() => ({ shiftKeyState: active })),
  setSpaceKeyState: (active: boolean) => set(() => ({ spaceKeyState: active })),
}));

export default useKeyboardStore;
