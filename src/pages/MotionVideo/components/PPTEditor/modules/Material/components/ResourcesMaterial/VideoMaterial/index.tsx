import useCreateElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useCreateElement';
import Uploader from '@/pages/MotionVideo/components/Uploader';
import { UploadOutlined } from '@ant-design/icons';
import { Delete } from '@icon-park/react';
import { Button, message, Modal, Spin } from 'antd';
import { useFileOperate } from '../hooks';
import styles from './index.less';

const VideoMaterial = () => {
  const { createVideoElement } = useCreateElement();

  const { listLoading, fileList, fileListRefresh, deleteFileAsync } =
    useFileOperate('video');

  return (
    <div className={styles.videos}>
      <Uploader
        type="video"
        number={1}
        maxCount={10}
        onUpload={() => {
          fileListRefresh();
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传视频
        </Button>
      </Uploader>

      <Spin spinning={listLoading}>
        <div className={styles.list}>
          {fileList?.map((item: { id: string; url: string; cover: string }) => (
            <div
              className={styles.item}
              key={item.id}
              onClick={() => {
                createVideoElement(item.url);
              }}
              style={{
                backgroundImage: `url(${item.cover})`,
              }}
            >
              <div
                className={styles.operate}
                onClick={(e) => {
                  e.stopPropagation();
                  Modal.confirm({
                    title: '删除',
                    content: '确认删除该素材吗？',
                    onOk: async () => {
                      const res = await deleteFileAsync(item.id);
                      message.success(res?.msg);
                      fileListRefresh();
                    },
                  });
                }}
              >
                <Delete />
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default VideoMaterial;
