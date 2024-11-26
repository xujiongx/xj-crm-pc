import { Button, Space } from 'antd';
import clsx from 'clsx';
import { useSlidesStore } from '../../store';
import styles from './index.less';

const Header = ({ className }: { className: string }) => {
  const slides = useSlidesStore((state) => state.slides);

  console.log('🤟', slides);

  const handleSave = () => {
    localStorage.setItem('slides', JSON.stringify(slides));
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
      </Space>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
      </Space>
    </div>
  );
};

export default Header;
