import { DemoElementType } from '../../../interface';
import { DemoConfig } from '../index';
import './index.less';

interface CarouselElementProps {
  decorator?: DemoElementType['decorator-props'];
  config?: DemoElementType['component-props'];
  style?: React.CSSProperties;
  showTitle?: boolean;
}

const CarouselElement = ({
  style,
  config = DemoConfig['component-props'],
}: CarouselElementProps) => {
  const prefixCls = 'desinger-carousel';

  return (
    <div style={style} className={prefixCls}>
      <h1>{config.title}</h1>
    </div>
  );
};

export default CarouselElement;
