import { OperateResizeHandlers } from '@/pages/MotionVideo/Editor/interface';
import clsx from 'clsx';
import styles from './index.less';

interface ResizeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  type?: OperateResizeHandlers;
  rotate?: number;
}

const Resize = ({ type, rotate = 0, className, ...rest }: ResizeProps) => {
  const rotateClassName = (() => {
    const prefix = 'rotate-';
    if (rotate > -22.5 && rotate <= 22.5) return prefix + 0;
    else if (rotate > 22.5 && rotate <= 67.5) return prefix + 45;
    else if (rotate > 67.5 && rotate <= 112.5) return prefix + 90;
    else if (rotate > 112.5 && rotate <= 157.5) return prefix + 135;
    else if (rotate > 157.5 || rotate <= -157.5) return prefix + 0;
    else if (rotate > -157.5 && rotate <= -112.5) return prefix + 45;
    else if (rotate > -112.5 && rotate <= -67.5) return prefix + 90;
    else if (rotate > -67.5 && rotate <= -22.5) return prefix + 135;
    return prefix + 0;
  })();

  return (
    <div
      {...rest}
      className={clsx(
        styles.resize,
        {
          [styles[`${type}`]]: type,
          [styles[`${rotateClassName}`]]: rotateClassName,
        },
        className,
      )}
    />
  );
};

export default Resize;
