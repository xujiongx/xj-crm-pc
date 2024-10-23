import DefaultImageIcon from './icon';
import styles from './index.module.less';

interface DefaultImageProps {
  style?: React.CSSProperties;
}

const DefaultImage = ({ style }: DefaultImageProps) => {
  return (
    <div className={styles['designer-default-image']} style={style}>
      <DefaultImageIcon />
    </div>
  );
};

export default DefaultImage;
