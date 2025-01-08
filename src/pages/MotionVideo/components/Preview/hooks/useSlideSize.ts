import { Ref, useEffect, useState } from 'react';

const RADIO_MAP = {
  '2': 16 / 9,
  '1': 9 / 16,
};

export default (
  wrapRef?: Ref<HTMLElement | null>,
  dimensionRatio?: '1' | '2',
) => {
  const viewportRatio = RADIO_MAP[dimensionRatio || '1'];

  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);

  // 计算和更新幻灯片内容的尺寸（按比例自适应屏幕）
  const setSlideContentSize = () => {
    const slideWrapRef = wrapRef?.current || document.body;
    const winWidth = slideWrapRef.clientWidth;
    const winHeight = slideWrapRef.clientHeight;
    let width, height;

    if (winHeight / winWidth === viewportRatio) {
      width = winWidth;
      height = winHeight;
    } else if (winHeight / winWidth > viewportRatio) {
      width = winWidth;
      height = winWidth * viewportRatio;
    } else {
      width = winHeight / viewportRatio;
      height = winHeight;
    }
    setSlideWidth(width);
    setSlideHeight(height);
  };

  useEffect(() => {
    setSlideContentSize();
    window.addEventListener('resize', setSlideContentSize);
    setSlideContentSize();

    return () => {
      window.removeEventListener('resize', setSlideContentSize);
    };
  }, []);

  return {
    slideWidth,
    slideHeight,
  };
};
