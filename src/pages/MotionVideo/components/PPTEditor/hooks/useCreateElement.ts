import { LinePoolItem } from '@/pages/MotionVideo/config/lines';
import {
  SHAPE_PATH_FORMULAS,
  ShapePoolItem,
} from '@/pages/MotionVideo/config/shapes';
import {
  PPTElement,
  PPTLineElement,
  PPTShapeElement,
} from '@/pages/MotionVideo/interface';
import { getImageSize } from '@/pages/MotionVideo/utils/image';
import { uid } from '@aicc/shared';
import { message } from 'antd';
import { nanoid } from 'nanoid';
import useMainStore from '../store/main';
import useSlidesStore from '../store/slides';
import useHistorySnapshot from './useHistorySnapshot';
import { VIEWPORT_SIZE } from './useViewportSize';

interface LineElementPosition {
  top: number;
  left: number;
  start: [number, number];
  end: [number, number];
}

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
  const { addHistorySnapshot } = useHistorySnapshot();
  const theme = useSlidesStore((store) => store.theme);

  const createElement = (element: PPTElement, callback?: () => void) => {
    useSlidesStore.getState().addElement(element);
    useMainStore.getState().setActiveElementIds([element.id]);
    if (creatingElement) setCreatingElement(null);
    setTimeout(() => {
      setEditorareaFocus(true);
    }, 0);
    if (callback) callback();
    addHistorySnapshot();
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
    const { viewportRatio } = useMainStore.getState();
    const { width, height, left, top } = position;
    const content = data?.content || '';
    const vertical = data?.vertical || false;

    createElement({
      type: 'text',
      id: uid(),
      left: left || (VIEWPORT_SIZE - width) / 2,
      top: top || (VIEWPORT_SIZE * viewportRatio - height) / 2,
      width,
      height,
      content,
      rotate: 0,
      defaultFontName: theme.fontName,
      defaultColor: theme.fontColor,
      vertical,
    });
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
          resolve(video);
        });
        video.addEventListener('error', () => {
          reject(new Error('Failed to load video'));
        });
      });
    };

    getDurationByUrl(src).then((video: any) => {
      if (!isNaN(video.duration) && video.duration !== Infinity) {
        createElement({
          type: 'video',
          id: nanoid(10),
          width: video.videoWidth,
          height: video.videoHeight,
          rotate: 0,
          left: (VIEWPORT_SIZE - video.videoWidth) / 2,
          top: (VIEWPORT_SIZE * viewportRatio - video.videoHeight) / 2,
          src,
          autoplay: false,
          duration: video.duration,
        });
      } else {
        message.error('素材加载失败，请检查素材是否可用');
      }
    });
  };

  /**
   * 创建形状元素
   * @param position 位置大小信息
   * @param data 形状路径信息
   */
  const createShapeElement = (
    position: CommonElementPosition,
    data: ShapePoolItem,
    supplement: Partial<PPTShapeElement> = {},
  ) => {
    const { left, top, width, height } = position;
    const newElement: PPTShapeElement = {
      type: 'shape',
      id: nanoid(10),
      left,
      top,
      width,
      height,
      viewBox: data.viewBox,
      path: data.path,
      fill: theme.themeColor,
      fixedRatio: false,
      rotate: 0,
      ...supplement,
    };
    if (data.withborder) newElement.outline = theme.outline;
    if (data.special) newElement.special = true;
    if (data.pathFormula) {
      newElement.pathFormula = data.pathFormula;
      newElement.viewBox = [width, height];

      const pathFormula = SHAPE_PATH_FORMULAS[data.pathFormula];
      if ('editable' in pathFormula && pathFormula.editable) {
        newElement.path = pathFormula.formula(
          width,
          height,
          pathFormula.defaultValue!,
        );
        newElement.keypoints = pathFormula.defaultValue;
      } else newElement.path = pathFormula.formula(width, height);
    }
    createElement(newElement);
  };

  /**
   * 创建线条元素
   * @param position 位置大小信息
   * @param data 线条的路径和样式
   */
  const createLineElement = (
    position: LineElementPosition,
    data: LinePoolItem,
  ) => {
    const { left, top, start, end } = position;

    const newElement: PPTLineElement = {
      type: 'line',
      id: nanoid(10),
      left,
      top,
      start,
      end,
      points: data.points,
      color: theme.themeColor,
      style: data.style,
      width: 2,
    };
    if (data.isBroken)
      newElement.broken = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    if (data.isBroken2)
      newElement.broken2 = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    if (data.isCurve)
      newElement.curve = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
    if (data.isCubic)
      newElement.cubic = [
        [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
        [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
      ];
    createElement(newElement);
  };

  /**
   * 创建音频元素
   * @param src 音频地址
   */
  const createAudioElement = (src: string) => {
    // // 通过url链接获取视频时长
    const getDurationByUrl = async (videoUrl) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('audio');
        video.src = videoUrl;
        video.addEventListener('loadedmetadata', () => {
          resolve(video);
        });
        video.addEventListener('error', () => {
          reject(new Error('Failed to load video'));
        });
      });
    };

    getDurationByUrl(src).then((video: any) => {
      if (!isNaN(video.duration) && video.duration !== Infinity) {
        createElement({
          type: 'audio',
          id: nanoid(10),
          width: 50,
          height: 50,
          rotate: 0,
          left: 0,
          top: 0,
          loop: false,
          autoplay: false,
          fixedRatio: true,
          color: theme.themeColor,
          src,
          duration: video.duration,
        });
      } else {
        message.error('素材加载失败，请检查素材是否可用');
      }
    });
  };

  const createDigitalRobotElement = (
    position: CommonElementPosition,
    data: any,
  ) => {
    const { left, top, width, height } = position;
    createElement({
      type: 'digitalRobot',
      id: nanoid(10),
      digitalRobotId: data.digitalRobotId,
      src: data.src,
      left,
      top,
      width,
      height,
      rotate: 0,
    });
  };

  return {
    createTextElement,
    createImageElement,
    createVideoElement,
    createShapeElement,
    createLineElement,
    createAudioElement,
    createDigitalRobotElement,
  };
};

export default useCreateElement;
