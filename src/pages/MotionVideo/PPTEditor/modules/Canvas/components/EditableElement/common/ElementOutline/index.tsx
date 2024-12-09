import useElementOutline from '../../hooks/useElementOutline';
import styles from './index.less';

const ElementOutline = (props) => {
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
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="butt"
        strokeMiterlimit="8"
        fill="transparent"
        d={`M0,0 L${width},0 L${width},${height} L0,${height} Z`}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeDasharray={strokeDashArray}
      ></path>
    </svg>
  );
};

export default ElementOutline;
