import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { PPTTextElement } from '@/pages/MotionVideo/PPTEditor/interface';
import { Button } from 'antd';
import styles from './index.less';

type PPTTextData = Omit<PPTTextElement, 'id' | 'type' | 'left' | 'top'>;

const DefaultImages: Array<PPTTextData> = [
  {
    width: 120,
    height: 0,
    content: '默认文本',
    lineHeight: 1.5,
    wordSpace: 0,
    rotate: 0,
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
    <div className={styles.list}>
      <Button onClick={() => onAdd()}>添加图片</Button>
    </div>
  );
};

export default ImageMaterial;
