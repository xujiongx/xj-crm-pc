import clsx from 'clsx';
import { ReactNode } from 'react';
import DIcon from '../../components/Element/DIcon';
import styles from './index.less';

const MaterialItem = ({
  title,
  icon,
  component,
  onClick,
  disabled,
}: {
  title: string;
  icon?: string | ReactNode;
  component: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const Icon = () => {
    if (typeof (icon || component) === 'string') {
      return <DIcon type={`icon-${icon || component}`} />;
    } else {
      return icon;
    }
  };

  return (
    <div
      style={{ position: 'relative' }}
      className={clsx({
        [styles.disabled]: disabled,
      })}
    >
      <div onClick={() => !disabled && onClick()} className={styles.item}>
        <div className={styles['item-icon']}>{Icon()}</div>
        <span className={styles['item-title']}>{title}</span>
      </div>
    </div>
  );
};

export default MaterialItem;
