import clsx from 'clsx';
import styles from './index.less';

const Header = ({ className }: { className: string }) => {
  return <div className={clsx(className, styles.header)}></div>;
};

export default Header;
