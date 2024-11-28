import { Button, Space } from 'antd';
import clsx from 'clsx';
import useScreening from '../../hooks/useScreening';
import { useSlidesStore } from '../../store';
import styles from './index.less';
const Header = ({ className }: { className: string }) => {
  const slides = useSlidesStore((state) => state.slides);
  const { enterScreeningFromStart } = useScreening();

  console.log('🤟', slides);

  const handleSave = () => {
    localStorage.setItem('slides', JSON.stringify(slides));
  };

  const handleExport = () => {
    history.pushState(null, '', `/api/slides/${slides[0].id}`);
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
      </Space>
      <Space>
        <Button onClick={() => handleSave()}>保存</Button>
        <Button onClick={() => handleExport()}>导出</Button>
        <Button onClick={() => enterScreeningFromStart()}>预览</Button>
      </Space>
    </div>
  );
};

export default Header;
