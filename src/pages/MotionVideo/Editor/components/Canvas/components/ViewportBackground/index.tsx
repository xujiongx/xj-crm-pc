import React from 'react';
import './index.less'

import useSlidesStore from '../../../../store/slides';
import useSlideBackgroundStyle from '../../../../hooks/useSlideBackgroundStyle';

const ViewportBackground: React.FC = () => {

  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const background = currentSlide()?.background;
  const { backgroundStyle } = useSlideBackgroundStyle(background);

  return (
    <div
      className="viewport-background"
      style={backgroundStyle}
    >
    </div>
  );
};

export default ViewportBackground;
