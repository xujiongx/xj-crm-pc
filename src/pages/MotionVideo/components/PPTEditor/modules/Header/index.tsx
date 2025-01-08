import { getUrlParams } from '@/utils';
import {
  ExportOutlined,
  LeftOutlined,
  SaveOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { message, Modal, Space } from 'antd';
import clsx from 'clsx';
import { ActionGroup } from 'qnzs-ui';
import { useState } from 'react';
import { useSaveCurVideo } from '../../hooks';
import useScreening from '../../hooks/useScreening';
import ExportVideoModal from './components/ExportVideoModal';
import styles from './index.less';

const Header = ({
  className,
  isEditorHsaChange,
}: {
  className: string;
  isEditorHsaChange: boolean;
}) => {
  const { name } = getUrlParams<{
    id: string;
    dimensionRatio: string;
    name: string;
  }>();

  const { enterScreeningFromStart } = useScreening();

  const { handleSaveCurVideo, updateVideoLoading } = useSaveCurVideo();

  const [isExportModalVisible, setIsExportModalVisible] = useState(false);

  const [isWithSave, setIsWithSave] = useState(false);

  const handleExport = () => {
    if (!isEditorHsaChange) {
      setIsExportModalVisible(true);
      return;
    }
    Modal.confirm({
      content: '您还未保存当前配置修改的内容，是否保存后再导出？',
      closable: true,
      onOk: () => {
        setIsWithSave(true);
        setIsExportModalVisible(true);
      },
      onCancel: (close) => {
        if (close && close.toString() === '() => {}') {
          return;
        }
        setIsWithSave(false);
        setIsExportModalVisible(true);
        close();
      },
    });
  };

  const handleSave = async () => {
    const res = await handleSaveCurVideo();
    if (!res?.code) message.success(res?.msg);
  };

  return (
    <div className={clsx(className, styles.header)}>
      <Space
        style={{ cursor: 'pointer', textWrap: 'nowrap', marginRight: '50px' }}
        onClick={() => history.back()}
      >
        <LeftOutlined />
        {name}
      </Space>
      <ActionGroup
        gap={60}
        onlyIcon
        maxLength={5}
        actions={[
          {
            key: 'save',
            title: '保存',
            icon: <SaveOutlined style={{ fontSize: '20px' }} />,
            loading: updateVideoLoading,
            onClick: () => {
              handleSave();
            },
          },
          {
            key: 'preview',
            title: '预览（按空格键播放）',
            icon: <VideoCameraOutlined style={{ fontSize: '20px' }} />,
            onClick: () => {
              enterScreeningFromStart();
            },
          },
          {
            key: 'export',
            title: '导出',
            icon: <ExportOutlined style={{ fontSize: '20px' }} />,

            onClick: () => {
              handleExport();
            },
          },
        ]}
        key="action"
      />
      <ExportVideoModal
        visible={isExportModalVisible}
        setVisible={setIsExportModalVisible}
        isWithSave={isWithSave}
      />
    </div>
  );
};

export default Header;
