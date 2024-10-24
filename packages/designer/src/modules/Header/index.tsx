import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import clsx from 'clsx';
import { ViewConfig } from '../../interface';
import useMainStore from '../../store';
import styles from './index.less';
import DesignerMoblieModal from './Modal';

interface HeaderProps {
  className: string;
  handleSave?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
  handlePublic?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
}

const Header = ({ className, handleSave, handlePublic }: HeaderProps) => {
  const preview = useMainStore((store) => store.preview);
  const elements = useMainStore((store) => store.elements);
  const viewConfig = useMainStore((store) => store.viewConfig);
  const item = useMainStore((store) => store.viewConfig.pageConfig);

  const onSuccess = (value) => {
    useMainStore.getState().updateViewPageConfig(value);
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space style={{ cursor: 'pointer' }} onClick={history.back}>
        <LeftOutlined />
        返回
      </Space>

      <Space>
        <div>
          {item?.title}
          {!preview && (
            <DesignerMoblieModal value={item} onSuccess={onSuccess}>
              <Button type="text" icon={<EditOutlined />} />
            </DesignerMoblieModal>
          )}
        </div>
      </Space>
      <Space size={10}>
        {!preview && (
          <>
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
                handlePublic?.({
                  elements,
                  viewConfig,
                })
              }
            >
              发布
            </Button>
          </>
        )}
      </Space>
    </div>
  );
};

export default Header;
