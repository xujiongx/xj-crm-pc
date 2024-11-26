import { useEffect } from 'react';
import Canvas from './components/Canvas';
import CanvasTool from './components/CanvasTool';
import Configure from './components/Configure';
import Header from './components/Header';
import Material from './components/Material';
import useGlobalHotkey from './hooks/useGlobalHotkey';
import styles from './index.less';
import { useSlidesStore } from './store'

const MotionVideoEditor = () => {
  useGlobalHotkey();

  useEffect(() => {
    document.oncontextmenu = (e) => e.preventDefault();
  }, []);

  const slides = useSlidesStore((state) => state.slides);

  console.log('👨‍⚖️', slides);

  return (
    <div className={styles.layout}>
      <Header className={styles['layout-header']} />
      <div className={styles['layout-content']}>
        <Material className={styles['layout-content-left']} />
        <div className={styles['layout-content-center']}>
          <CanvasTool className={styles['center-top']} />
          <Canvas />
        </div>
        <Configure className={styles['layout-content-right']} />
      </div>
    </div>
  );
};

export default MotionVideoEditor;
