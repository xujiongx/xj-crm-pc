import Uploader from '@/pages/MotionVideo/PPTEditor/components/Uploader';
import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { uid } from '@aicc/shared';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import styles from './index.less';

const imageList = localStorage.getItem('imageList')
  ? JSON.parse(localStorage.getItem('imageList') || '[]')
  : [];

const fetchImageList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: imageList,
      });
    }, 1000);
  });
};

const ImageMaterial = () => {
  const { createImageElement } = useCreateElement();

  const { loading, data } = useRequest(
    async () => {
      const res = await fetchImageList();
      return res.data;
    },
    {
      cacheKey: `fetchImageList`,
    },
  );

  return (
    <div className={styles.images}>
      <Uploader
        type="image"
        number={1}
        maxCount={10}
        onUpload={(v) => {
          console.log('👲', v);
          const newList = [
            ...imageList,
            {
              id: uid(),
              url: v,
            },
          ];
          localStorage.setItem('imageList', JSON.stringify(newList));
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传图片
        </Button>
      </Uploader>
      <div className={styles.list}>
        {data?.map((item) => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => createImageElement(item.url)}
            style={{
              backgroundImage: `url(${item.url})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageMaterial;
