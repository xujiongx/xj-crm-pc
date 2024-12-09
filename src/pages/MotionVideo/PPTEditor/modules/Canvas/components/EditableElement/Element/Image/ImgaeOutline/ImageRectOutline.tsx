import useElementOutline from '../../../hooks/useElementOutline';
import styles from './index.less';

const ImageRectOutline = (props) => {
  const { width, height, outline, radius = 0 } = props;

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
      <rect
        vectorEffect="non-scaling-stroke"
        strokeLinecap="butt"
        strokeMiterlimit="8"
        fill="transparent"
        rx={radius}
        ry={radius}
        width={width}
        height={height}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeDasharray={strokeDashArray}
      ></rect>
    </svg>
  );
};

export default ImageRectOutline;
