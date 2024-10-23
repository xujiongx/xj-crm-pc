import Viewport from './Viewport';
import styles from './index.less';

const Canvas = () => {
  return (
    <div className={styles.canvas}>
      <div className={styles['canvas-header']}></div>
      <div className={styles['canvas-body']}>
        <Viewport />
      </div>
    </div>
  );
};

export default Canvas;
