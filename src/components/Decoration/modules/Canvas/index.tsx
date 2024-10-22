import Viewport from './Viewport';
import styles from './index.less';

const Canvas = <T,>() => {
  return (
    <div className={styles.canvas}>
      <div className={styles['canvas-header']}></div>
      <div className={styles['canvas-body']}>
        <Viewport<T> />
      </div>
    </div>
  );
};

export default Canvas;
