import MUSIC_SRC from '@/assets/mg/music.png';
import useCreateElement from '@/pages/MotionVideo/components/PPTEditor/hooks/useCreateElement';
import Uploader from '@/pages/MotionVideo/components/Uploader';
import { UploadOutlined } from '@ant-design/icons';
import { Delete } from '@icon-park/react';
import { Button, message, Modal, Spin } from 'antd';
import { useFileOperate } from '../hooks';
import styles from './index.less';

const AudioMaterial = () => {
  const { listLoading, fileList, fileListRefresh, deleteFileAsync } =
    useFileOperate('audio');

  const { createAudioElement } = useCreateElement();

  console.log('👩‍🦳', fileList);

  return (
    <div className={styles.videos}>
      <Uploader
        type="audio"
        number={1}
        maxCount={10}
        onUpload={() => {
          fileListRefresh();
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传音频
        </Button>
      </Uploader>

      <Spin spinning={listLoading}>
        <div className={styles.list}>
          {fileList?.map((item: { id: string; url: string; cover: string }) => (
            <div
              className={styles.item}
              key={item.id}
              onClick={() => {
                console.log('👩‍❤️‍💋‍👩', item.url);
                createAudioElement(item.url);
              }}
              style={{
                backgroundImage: `url(${MUSIC_SRC})`,
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

export default AudioMaterial;
