import { KEYS } from '@/pages/MotionVideo/config/hotkey';
import { SlideItem } from '@/pages/MotionVideo/interface';
import { copyText, readClipboard } from '@/pages/MotionVideo/utils/clipboard';
import { encrypt } from '@/pages/MotionVideo/utils/crypto';
import { createElementIdMap } from '@/pages/MotionVideo/utils/element';
import { message } from 'antd';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
import { useMainStore, useSlidesStore } from '../store';
import useAddSlidesOrElements from './useAddSlidesOrElements';
import useHistorySnapshot from './useHistorySnapshot';
import usePasteTextClipboardData from './usePasteTextClipboardData';

const useSlideHandler = () => {
  const setActiveElementIdList = useMainStore(
    (store) => store.setActiveElementIds,
  );

  const updateSlideIndex = useSlidesStore((store) => store.updateSlideIndex);
  const setSlides = useSlidesStore((store) => store.setSlides);
  const deleteSlide = useSlidesStore((store) => store.deleteSlide);

  const slides = useSlidesStore((store) => store.slides);

  const slideIndex = useSlidesStore((store) => store.slideIndex);
  const setThumbnailsFocus = useMainStore((store) => store.setThumbnailsFocus);

  const activeElementIdList = useMainStore((store) => store.activeElementIds);

  const addSlide = useSlidesStore((state) => state.addSlide);
  const currentSlide = useSlidesStore(
    (state) => state.slides[state.slideIndex],
  );

  const { addHistorySnapshot } = useHistorySnapshot();

  const selectedSlideId = currentSlide?.id;

  const theme = useSlidesStore((store) => store.theme);

  const { pasteTextClipboardData } = usePasteTextClipboardData();
  const { addSlidesFromData } = useAddSlidesOrElements();

  // 重置幻灯片
  const resetSlides = () => {
    const emptySlide: SlideItem = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.backgroundColor,
      },
    };
    updateSlideIndex(0);
    setSlides([emptySlide]);
  };

  /**
   * 移动页面焦点
   * @param command 移动页面焦点命令：上移、下移
   */
  const handleUpdateSlideIndex = (command: string) => {
    if (command === KEYS.UP && slideIndex > 0) {
      if (activeElementIdList.length) setActiveElementIdList([]);
      updateSlideIndex(slideIndex - 1);
    } else if (command === KEYS.DOWN && slideIndex < slides.length - 1) {
      if (activeElementIdList.length) setActiveElementIdList([]);
      updateSlideIndex(slideIndex + 1);
    }
  };

  // 将当前页面数据加密后复制到剪贴板
  const copySlide = () => {
    const text = encrypt(
      JSON.stringify({
        type: 'slides',
        data: [currentSlide],
      }),
    );

    copyText(text).then(() => {
      setThumbnailsFocus(true);
    });
  };

  // 尝试将剪贴板页面数据解密后添加到下一页（粘贴）
  const pasteSlide = () => {
    readClipboard()
      .then((text) => {
        pasteTextClipboardData(text, { onlySlide: true });
      })
      .catch((err) => message.warning(err));
  };

  // 创建一页空白页并添加到下一页
  const createSlide = () => {
    const emptySlide: SlideItem = {
      id: nanoid(10),
      elements: [],
      background: {
        type: 'solid',
        color: theme.backgroundColor,
      },
    };
    setActiveElementIdList([]);
    addSlide(emptySlide);
    addHistorySnapshot();
  };

  // 根据模板创建新页面
  const createSlideByTemplate = (slide: SlideItem) => {
    const { groupIdMap, elIdMap } = createElementIdMap(slide.elements);

    for (const element of slide.elements) {
      element.id = elIdMap[element.id];
      if (element.groupId) element.groupId = groupIdMap[element.groupId];
    }
    const newSlide = {
      ...slide,
      id: nanoid(10),
    };
    setActiveElementIdList([]);
    addSlide(newSlide);
    addHistorySnapshot();
  };

  // 将当前页复制一份到下一页
  const copyAndPasteSlide = () => {
    const slide = JSON.parse(JSON.stringify(currentSlide));
    addSlidesFromData([slide]);
  };

  // 删除当前页，若将删除全部页面，则执行重置幻灯片操作
  const handleDeleteSlide = (targetSlideId = selectedSlideId) => {
    if (slides.length === 1) {
      resetSlides();
    } else {
      deleteSlide(targetSlideId);
    }
    updateSlideIndex(0);
  };

  // 将当前页复制后删除（剪切）
  // 由于复制操作会导致多选状态消失，所以需要提前将需要删除的页面ID进行缓存
  const cutSlide = () => {
    copySlide();
    handleDeleteSlide(selectedSlideId);
  };

  // 拖拽调整幻灯片顺序同步数据
  const sortSlides = (newIndex: number, oldIndex: number) => {
    if (oldIndex === newIndex) return;

    const _slides: SlideItem[] = JSON.parse(JSON.stringify(slides));

    const movingSlide = _slides[oldIndex];
    const movingSlideSection = movingSlide.sectionTag;
    if (movingSlideSection) {
      const movingSlideSectionNext = _slides[oldIndex + 1];
      delete movingSlide.sectionTag;
      if (movingSlideSectionNext && !movingSlideSectionNext.sectionTag) {
        movingSlideSectionNext.sectionTag = movingSlideSection;
      }
    }
    if (newIndex === 0) {
      const firstSection = _slides[0].sectionTag;
      if (firstSection) {
        delete _slides[0].sectionTag;
        movingSlide.sectionTag = firstSection;
      }
    }

    const _slide = _slides[oldIndex];
    _slides.splice(oldIndex, 1);
    _slides.splice(newIndex, 0, _slide);
    setSlides(_slides);
    updateSlideIndex(newIndex);
  };

  const isEmptySlide = useMemo(() => {
    if (!slides) return false;
    if (slides.length > 1) return false;
    if (slides[0]?.elements.length > 0) return false;
    return true;
  }, [slides]);

  return {
    resetSlides,
    updateSlideIndex: handleUpdateSlideIndex,
    copySlide,
    pasteSlide,
    createSlide,
    createSlideByTemplate,
    copyAndPasteSlide,
    deleteSlide: handleDeleteSlide,
    cutSlide,
    sortSlides,
    isEmptySlide,
  };
};

export default useSlideHandler;
