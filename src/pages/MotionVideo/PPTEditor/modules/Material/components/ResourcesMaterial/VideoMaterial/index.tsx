import Uploader from '@/pages/MotionVideo/PPTEditor/components/Uploader';
import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { uid } from '@aicc/shared';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import { useState } from 'react';
import styles from './index.less';
// const videoList = [
//   {
//     id: '1',
//     poster:
//       'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
//     url: 'https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm',
//   },
//   {
//     id: '2',
//     poster:
//       'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
//     url: '/minio/train/cause/2024/12/5/企业微信基础功能使用方法_1733380063953.mp4',
//   },
//   {
//     id: '3',
//     poster: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
//     url: '/minio/train/cause/2024/12/5/企业微信基础功能使用方法_1733380063953.mp4',
//   },
//   {
//     id: '4',
//     poster: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
//     url: '/minio/train/cause/2024/12/5/企业微信基础功能使用方法_1733380063953.mp4',
//   },
//   {
//     id: '5',
//     poster: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
//     url: '/minio/train/cause/2024/12/5/企业微信基础功能使用方法_1733380063953.mp4',
//   },
// ];

const videoList = localStorage.getItem('videoList')
  ? JSON.parse(localStorage.getItem('videoList') || '[]')
  : [];

const fetchVideoList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: videoList,
      });
    }, 1000);
  });
};

const VideoMaterial = () => {
  const { createVideoElement } = useCreateElement();

  const onAdd = () => {
    createVideoElement(
      'https://mazwai.com/videvo_files/video/free/2019-01/small_watermarked/181004_04_Dolphins-Whale_06_preview.webm',
    );
  };

  const [urls, setUrls] = useState<string[]>([]);

  const { loading, data = [] } = useRequest(
    async () => {
      const res = await fetchVideoList();
      return res.data;
    },
    {
      cacheKey: `fetchVideoList`,
    },
  );

  return (
    <div className={styles.videos}>
      <Uploader
        type="video"
        number={1}
        maxCount={10}
        onUpload={(v) => {
          console.log('👲', v);
          const newList = [
            ...videoList,
            {
              id: uid(),
              url: v,
              poster:
                'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
            },
          ];
          localStorage.setItem('videoList', JSON.stringify(newList));
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传视频
        </Button>
      </Uploader>

      <div className={styles.list}>
        {data.map((item) => (
          <div
            className={styles.item}
            key={item.id}
            onClick={() => {
              createVideoElement(item.url);
            }}
            style={{
              backgroundImage: `url(${item.poster})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default VideoMaterial;
