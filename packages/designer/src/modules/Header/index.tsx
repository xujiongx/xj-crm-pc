import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import clsx from 'clsx';
import { ViewConfig } from '../../interface';
import useMainStore from '../../store';
import styles from './index.less';

interface HeaderProps {
  className: string;
  handleSave?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
}

const Header = ({ className, handleSave }: HeaderProps) => {
  const elements = useMainStore((store) => store.elements);
  const viewConfig = useMainStore((store) => store.viewConfig);
  const item = useMainStore((store) => store.viewConfig.pageConfig);

  return (
    <div className={clsx(className, styles.header)}>
      <Space style={{ cursor: 'pointer' }} onClick={history.back}>
        <LeftOutlined />
        返回
      </Space>

      <Space>
        <div>
          {item?.title}
          <Button type="text" icon={<EditOutlined />} />
        </div>
      </Space>

      <Space size={10}>
        <Button
          onClick={() =>
            handleSave?.({
              elements,
              viewConfig,
            })
          }
        >
          保存
        </Button>
        <Button
          type="primary"
          onClick={() =>
            handleSave?.({
              elements,
              viewConfig,
            })
          }
        >
          发布
        </Button>
      </Space>
    </div>
  );
};

export default Header;
