import { uid } from '@aicc/shared';
import { PPTElement } from '../interface';
import useMainStore from '../store/main';
import useSlidesStore from '../store/slides';
import { getImageSize } from '../utils/image';
import useHistorySnapshot from './useHistorySnapshot';
import { VIEWPORT_SIZE } from './useViewportSize';

interface CommonElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CreateTextData {
  content?: string;
  vertical?: boolean;
}

const useCreateElement = () => {
  const { creatingElement, setCreatingElement, setEditorareaFocus } =
    useMainStore();
  const { add } = useHistorySnapshot();
  const { theme } = useSlidesStore();

  const createElement = (element: PPTElement, callback?: () => void) => {
    useSlidesStore.getState().addElement(element);
    useMainStore.getState().setActiveElementIds([element.id]);
    if (creatingElement) setCreatingElement(null);
    setTimeout(() => {
      setEditorareaFocus(true);
    }, 0);
    if (callback) callback();
    add();
  };

  const createImageElement = (src: string) => {
    const { viewportRatio } = useMainStore.getState();
    getImageSize(src).then(({ width, height }) => {
      const scale = height / width;
      if (scale < viewportRatio && width > VIEWPORT_SIZE) {
        width = VIEWPORT_SIZE;
        height = width * scale;
      } else if (height > VIEWPORT_SIZE * viewportRatio) {
        height = VIEWPORT_SIZE * viewportRatio;
        width = height / scale;
      }
      createElement({
        type: 'image',
        id: uid(),
        src,
        width,
        height,
        left: (VIEWPORT_SIZE - width) / 2,
        top: (VIEWPORT_SIZE * viewportRatio - height) / 2,
        fixedRatio: true,
        rotate: 0,
      });
    });
  };

  /**
   * 创建文本元素
   * @param position 位置大小信息
   * @param content 文本内容
   */
  const createTextElement = (
    position: CommonElementPosition,
    data?: CreateTextData,
  ) => {
    const { left, top, width, height } = position;
    const content = data?.content || '';
    const vertical = data?.vertical || false;

    const id = uid();
    createElement(
      {
        type: 'text',
        id,
        left,
        top,
        width,
        height,
        content,
        rotate: 0,
        defaultFontName: theme.fontName,
        defaultColor: theme.fontColor,
        vertical,
      },
      () => {},
    );
  };

  return {
    createTextElement,
    createImageElement,
  };
};

export default useCreateElement;
