import DefaultImage from '@aicc/designer/es/components/Element/DefaultImage';
import { Carousel } from 'antd';
import { CarouselElementType, CarouselMaterial } from '../index';
import './index.less';

interface CarouselElementProps {
  decorator?: CarouselElementType['decorator-props'];
  config?: CarouselElementType['component-props'];
  style?: React.CSSProperties;
  showTitle?: boolean;
}

const CarouselElement = ({
  style,
  config = CarouselMaterial['component-props'],
}: CarouselElementProps) => {
  const prefixCls = 'desinger-carousel';

  return (
    <div style={style} className={prefixCls}>
      <Carousel autoplay>
        {config?.images?.map((image, index) => (
          <div key={index}>
            {image.imgUrl ? (
              <img
                style={{ height: config?.height }}
                className={`${prefixCls}-item`}
                src={image.imgUrl}
              />
            ) : (
              <DefaultImage style={{ height: config?.height }} />
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselElement;
