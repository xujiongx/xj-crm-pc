import H5_URL from '@/assets/mg/h5.png';
import PC_URL from '@/assets/mg/pc.png';
import clsx from 'clsx';
import styles from './index.less';

const RadioSelectFiled = (props) => {
  const { value, onChange } = props;

  return (
    <div className={styles['list']}>
      <div
        className={clsx({
          [styles['item']]: true,
          [styles['active']]: value === 1,
        })}
        onClick={() => {
          onChange(1);
        }}
        style={{
          backgroundImage: `url('${PC_URL}')`,
        }}
      ></div>
      <div
        className={clsx({
          [styles['item']]: true,
          [styles['active']]: value === 2,
        })}
        onClick={() => {
          onChange(2);
        }}
        style={{
          backgroundImage: `url('${H5_URL}')`,
        }}
      ></div>
    </div>
  );
};

export default RadioSelectFiled;
