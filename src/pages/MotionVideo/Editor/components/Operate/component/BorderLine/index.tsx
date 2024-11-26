import { OperateBorderLines } from '@/pages/MotionVideo/Editor/interface';
import clsx from 'clsx';
import styles from './index.less';

interface BorderLineProps {
  type: OperateBorderLines;
  isWide?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BorderLine = ({ type, isWide, className, style }: BorderLineProps) => {
  return (
    <div
      style={style}
      className={clsx(styles['border-line'], className, {
        [styles[`border-line-${type}`]]: true,
        [styles[`border-line-wide`]]: isWide,
      })}
    />
  );
};

export default BorderLine;
