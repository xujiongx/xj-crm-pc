import { SlideItem } from '@/pages/MotionVideo/components/PPTEditor/interface';
import { nanoid } from 'nanoid';

const CAN_USE_ELEMENT_TYPE = ['text', 'image', 'video'];

const useImportSlides = () => {
  /**
   * 添加指定的页面数据
   * @param slide 页面数据
   */
  const importSlidesFromData = (slides: SlideItem[]) => {
    const newSlides = slides.map((slide) => {
      const elements = slide.elements.filter((element) =>
        CAN_USE_ELEMENT_TYPE.includes(element.type),
      );

      const animations = elements.map((el) => {
        return {
          id: nanoid(10),
          elId: el.id,
          effect: 'show',
          start: 0,
          end: 1,
          name: '一直展示',
          type: 'in' as const,
        };
      });
      const videoAnimations = elements
        .filter((el) => el.type === 'video')
        .map((el) => {
          return {
            id: nanoid(10),
            elId: el.id,
            effect: 'show',
            start: 1,
            end: el.duration + 1,
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

  return {
    importSlidesFromData,
  };
};

export default useImportSlides;
