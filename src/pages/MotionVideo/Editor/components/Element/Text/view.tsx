import { PPTTextElement } from '../../../interface';
import { computeShadowStyle } from '../utils';
import styles from './index.less';

interface TextViewProps {
  element: PPTTextElement;
}

const TextView = ({ element }: TextViewProps) => {
  return (
    <div
      className={styles['text-element']}
      style={{
        top: element.top,
        left: element.left,
        width: element.width,
        height: element.height,
      }}
    >
      <div
        className={styles['rotate-wrapper']}
        style={{ transform: `rotate(${element.rotate}deg)` }}
      >
        <div
          className={styles['element-content']}
          style={{
            width: element.vertical ? 'auto' : element.width + 'px',
            height: element.vertical ? element.height + 'px' : 'auto',
            backgroundColor: element.fill,
            opacity: element.opacity,
            textShadow: computeShadowStyle(element.shadow),
            lineHeight: element.lineHeight,
            letterSpacing: (element.wordSpace || 0) + 'px',
            color: element.defaultColor,
            fontFamily: element.defaultFontName,
            writingMode: element.vertical ? 'vertical-rl' : 'horizontal-tb',
          }}
        >
          <div className={styles['text']}>{element.content}</div>
        </div>
      </div>
    </div>
  );
};

export default TextView;