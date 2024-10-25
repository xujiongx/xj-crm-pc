import Calibration from './components/Calibration';
import styles from './index.less';
import EditorCanvas from './modules/Canvas';
const QDesigner = () => {
  const scaleNum = 1;
  return (
    <div className={styles['container']}>
      <div className={styles['header']}>header</div>
      <div className={styles['main']}>
        <div className={styles['left']}>left</div>
        <div className={styles['center']}>
          {/* <div className={styles['operate']}>operate</div> */}
          <div className={styles['canvas']}>
            <div className={styles.tickMarkTop}>
              <Calibration
                direction="up"
                id="calibrationUp"
                multiple={scaleNum}
              />
            </div>
            <div className={styles.tickMarkLeft}>
              <Calibration
                direction="right"
                id="calibrationRight"
                multiple={scaleNum}
              />
            </div>
            <EditorCanvas />
          </div>
          {/* <div className={styles['bottom']}>bottom</div> */}
        </div>
        <div className={styles['right']}>right</div>
      </div>
      <div className={styles['float']}>floating</div>
    </div>
  );
};

export default QDesigner;
