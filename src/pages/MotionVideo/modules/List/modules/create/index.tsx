import { useState } from 'react';
import CreateEmptyModal from '../../components/CreateEmptyModal';
import PPTImportModal from '../../components/ImportPPTModal';

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { IconFont } from '@aicc/components'

const VideoCreate = (props) => {
  const { refresh } = props;
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [isShowPPTImportModal, setIsShowPPTImportModal] = useState(false);

  const handleCreateEmptyVideo = () => {
    setIsShowCreateModal(true);
  };

  const handleImportPPT = () => {
    setIsShowPPTImportModal(true);
  };

  return (
    <>
      <Flex gap={12}>
        <Button onClick={() => handleCreateEmptyVideo()}>
          <PlusCircleOutlined /> 新增视频
        </Button>
        <Button type="primary" onClick={() => handleImportPPT()}>
          <IconFont type="icon-upload1" style={{ fontSize: '16px' }} />
          PPT转视频
        </Button>
      </Flex>
      <CreateEmptyModal
        visible={isShowCreateModal}
        setVisible={setIsShowCreateModal}
        refresh={refresh}
      />
      <PPTImportModal
        visible={isShowPPTImportModal}
        setVisible={setIsShowPPTImportModal}
        refresh={refresh}
      />
    </>
  );
};

export default VideoCreate;
