import Uploader from '@/pages/MotionVideo/PPTEditor/components/Uploader';
import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { UploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from './index.less';

const imageList = [
  {
    id: '1',
    url: 'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
  },
  {
    id: '2',
    url: 'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
  },
  {
    id: '3',
    url: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
  },
  {
    id: '4',
    url: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
  },
  {
    id: '5',
    url: '/minio/train/cause/2024/12/5/测试_1733379914942.png',
  },
];

const ImageMaterial = () => {
  const { createImageElement } = useCreateElement();

  const onAdd = () => {
    createImageElement(
      'https://aicc-test.qnzsai.com/minio/customer/setting/354049_1710742538286.jpg',
    );
  };

  return (
    <div className={styles.images}>
      {/* <Button block icon={<UploadOutlined />} onClick={() => onAdd()}>
        上传图片
      </Button> */}
      <Uploader
        type="image"
        number={1}
        maxCount={10}
        onUpload={(v) => {
          console.log('👲', v);
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传图片
        </Button>
      </Uploader>
      <div className={styles.list}>
        {imageList.map((item) => (
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
