import useClipImage from '../useClipImage';
import ImageEllipseOutline from './ImageEllipseOutline';
import ImagePolygonOutline from './ImagePolygonOutline';
import ImageRectOutline from './ImageRectOutline';
import styles from './index.less';

const ImageOutline = (props) => {
  const { element } = props;
  const { clipShape } = useClipImage(element);

  return (
    <div className={styles['image-outline']}>
      {clipShape.type === 'rect' && (
        <ImageRectOutline
          width={element.width}
          height={element.height}
          outline={element.outline}
          radius={clipShape.radius}
        />
      )}
      {clipShape.type === 'ellipse' && (
        <ImageEllipseOutline
          width={element.width}
          height={element.height}
          outline={element.outline}
        />
      )}
      {clipShape.type === 'polygon' && (
        <ImagePolygonOutline
          width={element.width}
          height={element.height}
          outline={element.outline}
          createPath={clipShape.createPath}
        />
      )}
    </div>
  );
};

export default ImageOutline;
