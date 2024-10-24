import { NavigationElementType } from '..';
import DIcon from '../../../components/Element/DIcon';
import styles from './index.less';

interface NavigationElementProps {
  decorator?: NavigationElementType['decorator-props'];
  config?: NavigationElementType['component-props'];
  style?: React.CSSProperties;
  showTitle?: boolean;
}

const NavigationElement = ({ style, config }: NavigationElementProps) => {
  const prefixCls = 'desinger-navigation';

  return (
    <div
      className={styles[`${prefixCls}-list`]}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${config?.count || 4}, 1fr)`,
      }}
    >
      {config?.sections?.map((section, index) => (
        <div className={styles[prefixCls]} key={index}>
          <div className={styles[`${prefixCls}-image`]}>
            {section.imgUrl ? (
              <img src={section.imgUrl} />
            ) : (
              <div className={styles[`${prefixCls}-image-default`]}>
                <DIcon type="icon-image" />
              </div>
            )}
          </div>
          <div
            className={styles[`${prefixCls}-title`]}
            style={{
              color: section.color,
            }}
          >
            {section.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NavigationElement;
