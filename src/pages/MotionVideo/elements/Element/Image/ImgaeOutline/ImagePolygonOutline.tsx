import useElementOutline from '../../../hooks/useElementOutline';
import styles from './index.less';

const ImagePolygonOutline = (props) => {
  const { width, height, outline, createPath } = props;

  const { outlineWidth, outlineColor, strokeDashArray } =
    useElementOutline(outline);

  if (!outline) return null;

  return (
    <svg
      className={styles['element-outline']}
      overflow="visible"
      width={width}
      height={height}
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="butt"
        strokeMiterlimit="8"
        fill="transparent"
        d={createPath(width, height)}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeDasharray={strokeDashArray}
      ></path>
    </svg>
  );
};

export default ImagePolygonOutline;
