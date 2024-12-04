import { uid } from '@aicc/shared';
import { nanoid } from 'nanoid';
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

  /**
   * 创建视频元素
   * @param src 视频地址
   */
  const createVideoElement = (src: string) => {
    const viewportRatio = useMainStore.getState().viewportRatio;

    // // 通过url链接获取视频时长
    const getDurationByUrl = async (videoUrl) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', () => {
          resolve(video.duration);
        });
        video.addEventListener('error', () => {
          reject(new Error('Failed to load video'));
        });
      });
    };
    // await getDurationByUrl(element.src);

    getDurationByUrl(src).then((duration: number) => {
      console.log(duration);

      createElement({
        type: 'video',
        id: nanoid(10),
        width: 500,
        height: 300,
        rotate: 0,
        left: (VIEWPORT_SIZE - 500) / 2,
        top: (VIEWPORT_SIZE * viewportRatio - 300) / 2,
        src,
        autoplay: false,
        duration,
      });
    });
  };

  return {
    createTextElement,
    createImageElement,
    createVideoElement,
  };
};

export default useCreateElement;
