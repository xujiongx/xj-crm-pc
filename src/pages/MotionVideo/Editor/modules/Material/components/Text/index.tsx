import useCreateElement from '@/pages/MotionVideo/Editor/hooks/useCreateElement';
import { PPTTextElement } from '@/pages/MotionVideo/Editor/interface';
import styles from './index.less';

type PPTTextData = Omit<PPTTextElement, 'id' | 'type' | 'left' | 'top'>;

const DefaultTextGroup: Array<PPTTextData> = [
  {
    name:'添加标题文字',
    width: 120,
    height: 0,
    content: '默认文本',
    lineHeight: 1.0,
    wordSpace: 0,
    rotate: 0,
  },
  {
    name:'添加副标题文字',
    width: 120,
    height: 0,
    content: '默认文本',
    lineHeight: 1.0,
    wordSpace: 0,
    rotate: 0,
  },
  {
    name:'添加正文文字',
    width: 120,
    height: 0,
    content: '默认文本',
    lineHeight: 1.0,
    wordSpace: 0,
    rotate: 0,
  },
];

const TextMaterial = () => {
  const { createTextElement } = useCreateElement();

  const addText = (item: PPTTextData) => {
    createTextElement(
      {
        left: 100,
        top: 100,
        width: 120,
        height: 0,
      },
      item,
    );
  };

  return (
    <div className={styles.list}>
      {DefaultTextGroup.map((item, index) => (
        <div key={index} className={styles.item} onClick={() => addText(item)}>
          添加标题文字
        </div>
      ))}
    </div>
  );
};

export default TextMaterial;
