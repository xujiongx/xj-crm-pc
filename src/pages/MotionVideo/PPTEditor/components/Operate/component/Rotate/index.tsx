import clsx from 'clsx';
import styles from './index.less';

interface RotateProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

const Rotate = ({ className, ...rest }: RotateProps) => (
  <div {...rest} className={clsx(styles.rotate, className)} />
);

export default Rotate;
