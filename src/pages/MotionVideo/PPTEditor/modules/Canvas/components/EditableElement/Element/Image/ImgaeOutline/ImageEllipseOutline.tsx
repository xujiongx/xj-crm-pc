import useElementOutline from '../../../hooks/useElementOutline';
import styles from './index.less';

const ImageEllipseOutline = (props) => {
  const { width, height, outline } = props;

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
      <ellipse
        vectorEffect="non-scaling-stroke"
        strokeLinecap="butt"
        strokeMiterlimit="8"
        fill="transparent"
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeDasharray={strokeDashArray}
      ></ellipse>
    </svg>
  );
};

export default ImageEllipseOutline;
