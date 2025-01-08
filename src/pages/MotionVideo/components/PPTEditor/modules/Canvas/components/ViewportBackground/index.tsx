import React from 'react';
import './index.less';

import useSlideBackgroundStyle from '../../../../hooks/useSlideBackgroundStyle';
import { useMainStore } from '../../../../store';
import useSlidesStore from '../../../../store/slides';
import GridLines from '../GridLines';

const ViewportBackground: React.FC = () => {
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );
  const background = currentSlide?.background;

  const { backgroundStyle } = useSlideBackgroundStyle(background);
  const gridLineSize = useMainStore((store) => store.gridLineSize);
  return (
    <div className="viewport-background" style={backgroundStyle}>
      {!!gridLineSize && <GridLines />}
    </div>
  );
};

export default ViewportBackground;
