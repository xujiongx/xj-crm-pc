import { useMemo } from 'react';
import { SlideBackground } from '../interface';

// 将页面背景数据转换为css样式
export default (background: SlideBackground | undefined) => {
  const backgroundStyle = useMemo(() => {
    if (!background) return { backgroundColor: '#fff' };

    const {
      type,
      color,
      image,
      imageSize,
      gradientColor,
      gradientRotate,
      gradientType,
    } = background;

    // 纯色背景
    if (type === 'solid') return { backgroundColor: color };
    // 背景图模式
    // 包括：背景图、背景大小，是否重复
    else if (type === 'image') {
      if (!image) return { backgroundColor: '#fff' };
      if (imageSize === 'repeat') {
        return {
          backgroundImage: `url(${image}`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
        };
      }
      return {
        backgroundImage: `url(${image}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: imageSize || 'cover',
      };
    }

    // 渐变色背景
    else if (type === 'gradient') {
      const rotate = gradientRotate || 0;
      const color1 = gradientColor ? gradientColor[0] : '#fff';
      const color2 = gradientColor ? gradientColor[1] : '#fff';

      if (gradientType === 'radial')
        return { backgroundImage: `radial-gradient(${color1}, ${color2}` };
      return {
        backgroundImage: `linear-gradient(${rotate}deg, ${color1}, ${color2}`,
      };
    }

    return { backgroundColor: '#fff' };
  }, [background]);

  return {
    backgroundStyle,
  };
};
