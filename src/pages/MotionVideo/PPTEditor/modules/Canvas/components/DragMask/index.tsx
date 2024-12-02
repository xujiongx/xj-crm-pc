import useKeyboardStore from '@/pages/MotionVideo/PPTEditor/store/keyboard';
import styles from './index.less';

const DragMask = () => {
  const spaceKeyState = useKeyboardStore((store) => store.spaceKeyState);

  if (!spaceKeyState) return null;

  return <div className={styles['drag-mask']} />;
};

export default DragMask;
