import clsx from 'clsx';
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
  icon?: string;
  component: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      style={{ position: 'relative' }}
      className={clsx({
        [styles.disabled]: disabled,
      })}
    >
      <div onClick={() => !disabled && onClick()} className={styles.item}>
        <div className={styles['item-icon']}>
          <DIcon type={`icon-${icon || component}`} />
        </div>
        <span className={styles['item-title']}>{title}</span>
      </div>
    </div>
  );
};

export default MaterialItem;
