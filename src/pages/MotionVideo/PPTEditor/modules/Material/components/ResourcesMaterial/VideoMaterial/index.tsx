import Uploader from '@/pages/MotionVideo/PPTEditor/components/Uploader';
import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { Button } from 'antd';
import { useState } from 'react';
import styles from './index.less';

const VideoMaterial = () => {
  const { createVideoElement } = useCreateElement();

  const onAdd = () => {
    createVideoElement(
      'https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm',
    );
  };

  const [urls, setUrls] = useState<string[]>([]);

  return (
    <div className={styles.list}>
      <Uploader
        type="video"
        number={1}
        maxCount={10}
        onUpload={(v) => setUrls([...urls, v])}
      />
      <Button onClick={() => onAdd()}>添加视频</Button>
      {urls.map((url) => (
        <div
          className={styles.item}
          key={url}
          onClick={() => {
            console.log('💁‍♀️', url);
            createVideoElement(url);
          }}
        >
          <video
            style={{ width: '100%', height: '100%' }}
            src={url}
            controls
          ></video>
        </div>
      ))}
    </div>
  );
};

export default VideoMaterial;
