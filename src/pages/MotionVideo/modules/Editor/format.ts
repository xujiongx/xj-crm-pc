import { uid } from '@aicc/shared';
import { SlideItem } from '../../interface';
import { formatElement } from './utils';

const CAN_USE_ELEMENT_TYPE = ['text', 'image', 'video','shape'];

/**
 * 添加指定的页面数据
 * @param slide 页面数据
 */
export const importSlidesFromData = (slides: SlideItem[]) => {
  console.log('🧤slides', slides);
  const newSlides = slides.map((slide) => {
    const elements = slide.elements
      .filter((element) => CAN_USE_ELEMENT_TYPE.includes(element.type))
      .map((element) => formatElement(element));

    // 基础入场动画
    const animations = elements.map((el) => {
      return {
        id: uid(),
        elId: el.id,
        effect: 'show',
        start: 0,
        end: 1,
        name: '一直展示',
        type: 'in' as const,
      };
    });
    // 视频播放动画
    const videoAnimations = elements
      .filter((el) => el.type === 'video')
      .map((el) => {
        return {
          id: uid(),
          elId: el.id,
          effect: 'show',
          start: 1,
          end: el.duration + 1, // TODO：后端暂未实现，如果后端不支持，后续使用url获取
          name: '视频',
          type: 'video' as const,
        };
      });

    return {
      ...slide,
      elements,
      animations: [...animations, ...videoAnimations],
    };
  });

  return newSlides;
};
