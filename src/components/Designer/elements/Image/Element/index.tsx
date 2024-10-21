import DefaultImage from '../../../components/Element/DefaultImage';
import { ImageElementType } from '../../../interface';
import styles from './index.less';

interface ImageElementProps {
  decorator?: ImageElementType['decorator-props'];
  config?: ImageElementType['component-props'];
  style?: React.CSSProperties;
  showTitle?: boolean;
}

const ImageElement = ({ style, config }: ImageElementProps) => {
  const prefixCls = 'desinger-image';

  return (
    <div style={style} className={styles[`${prefixCls}-list`]}>
      {config?.images?.map((image, index) => (
        <div className={styles[prefixCls]} key={index}>
          {image.imgUrl ? (
            <img src={image.imgUrl} />
          ) : (
            <DefaultImage style={{ height: 200 }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageElement;
