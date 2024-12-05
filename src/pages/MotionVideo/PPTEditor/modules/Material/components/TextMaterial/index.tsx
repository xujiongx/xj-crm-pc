import useCreateElement from '@/pages/MotionVideo/PPTEditor/hooks/useCreateElement';
import { PPTTextElement } from '@/pages/MotionVideo/PPTEditor/interface';
import styles from './index.less';

type PPTTextData = Omit<PPTTextElement, 'id' | 'type' | 'left' | 'top'>;

const DefaultTextGroup: Array<PPTTextData> = [
  {
    name: '添加横排文字',
    width: 120,
    height: 0,
    content: '默认文本',
    lineHeight: 1.0,
    wordSpace: 0,
    rotate: 0,
    vertical: false,
  },
  {
    name: '添加竖排文字',
    width: 0,
    height: 120,
    content: '默认文本',
    lineHeight: 1.0,
    wordSpace: 0,
    rotate: 0,
    vertical: true,
  },
];

const TextMaterial = () => {
  const { createTextElement } = useCreateElement();

  const addText = (item: PPTTextData) => {
    createTextElement(
      {
        width: item.width,
        height: item.height,
      },
      item,
    );
  };

  return (
    <div className={styles.list}>
      {DefaultTextGroup.map((item, index) => (
        <div key={index} className={styles.item} onClick={() => addText(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default TextMaterial;
