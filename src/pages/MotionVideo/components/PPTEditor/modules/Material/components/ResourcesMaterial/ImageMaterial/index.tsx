import useCreateElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useCreateElement';
import Uploader from '@/pages/MotionVideo/components/Uploader';
import { UploadOutlined } from '@ant-design/icons';
import { Delete } from '@icon-park/react';
import { Button, message, Modal, Spin } from 'antd';
import { useFileOperate } from '../hooks';
import styles from './index.less';

const ImageMaterial = () => {
  const { createImageElement } = useCreateElement();

  const { listLoading, fileList, fileListRefresh, deleteFileAsync } =
    useFileOperate('picture');

  return (
    <div className={styles.images}>
      <Uploader
        type="image"
        number={1}
        maxCount={10}
        onUpload={(v) => {
          fileListRefresh();
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传图片
        </Button>
      </Uploader>
      <Spin spinning={listLoading}>
        <div className={styles.list}>
          {fileList?.map((item: { id: string; url: string }) => (
            <div
              key={item.id}
              className={styles.item}
              onClick={() => createImageElement(item.url)}
              style={{
                backgroundImage: `url(${item.url})`,
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

export default ImageMaterial;
