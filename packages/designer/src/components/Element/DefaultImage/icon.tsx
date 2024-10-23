import DIcon from '../DIcon';
import styles from './index.module.less';

const DefaultImageIcon = () => {
  return (
    <div className={styles['designer-default-image-icon']}>
      <DIcon type="icon-image" />
    </div>
  );
};

export default DefaultImageIcon;
