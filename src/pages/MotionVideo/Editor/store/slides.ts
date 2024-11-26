import { create } from 'zustand';
import { PPTElement, SlideItem, SlideTheme } from '../interface';
import useMainStore from './main';
import useSnapshotStore from './snapshot';

type State = {
  theme: SlideTheme;
  slides: SlideItem[];
  slideIndex: number;
};

interface UpdateElementData {
  id: string | string[];
  props: Partial<PPTElement>;
  slideId?: string;
}

type Actions = {
  currentSlide: () => SlideItem;
  activeElements: () => PPTElement[];
  setSlide: (slide: SlideItem) => void;
  setSlides: (slides: SlideItem[]) => void;
  updateSlideIndex: (index: number) => void;
  addSlide: (slide: SlideItem | SlideItem[]) => void;
  updateSlide: (props: Partial<SlideItem>) => void;
  deleteSlide: (slideId: string | string[]) => void;
  addElement: (element: PPTElement | PPTElement[]) => void;
  deleteElement: (elementId: string | string[]) => void;
  updateElement: (data: UpdateElementData) => void;
  setTheme: (themeProps: Partial<SlideTheme>) => void;
};

const defaultTheme = {
  themeColor: '#5b9bd5',
  fontColor: '#333',
  fontName: 'Microsoft Yahei',
  backgroundColor: '#fff',
};

const useSlidesStore = create<State & Actions>((set, get) => ({
  /** 幻灯片页面数据 */
  slides: [],
  /** 当前页面索引 */
  slideIndex: -1,

  theme: defaultTheme,

  currentSlide: () => get().slides[get().slideIndex],

  // 活跃幻灯片的活跃元素
  activeElements: () => {
    let currentSlide = get().currentSlide;
    return (
      currentSlide()?.elements?.filter((el) =>
        useMainStore.getState().activeElementIds.includes(el.id),
      ) || []
    );
  },

  setTheme: (themeProps: Partial<SlideTheme>) => {
    set((state) => ({ theme: { ...state.theme, ...themeProps } }));
  },

  setSlide: (slide: SlideItem) =>
    set((strore) => {
      const slides = [...strore.slides];
      slides[strore.slideIndex] = slide;

      const currentSlide = () => slides[strore.slideIndex];
      return { slides, currentSlide };
    }),

  setSlides: (slides: SlideItem[]) => set(() => ({ slides: [...slides] })),

  updateSlideIndex: (index: number) => {
    useSnapshotStore.getState().init(get().slides[index]);

    set((store) => {
      const currentSlide = () => store.slides[index];
      return { slideIndex: index, currentSlide };
    });
  },

  addSlide(slide: SlideItem | SlideItem[]) {
    set((state) => {
      const slides = Array.isArray(slide) ? slide : [slide];
      const newSlides = [...state.slides];
      const addIndex = state.slideIndex;
      newSlides.splice(addIndex, 0, ...slides);
      const currentSlide = () => newSlides[addIndex];
      return {
        slides: newSlides,
        slideIndex: addIndex,
        currentSlide,
      };
    });
  },

  updateSlide(props: Partial<SlideItem>) {
    set((state) => {
      const index = state.slideIndex;
      const slides = state.slides;
      slides[index] = { ...slides[index], ...props };
      const currentSlide = () => state.slides[index];
      return { slides, currentSlide };
    });
  },

  deleteSlide(slideId: string | string[]) {
    set((state) => {
      const slidesId = Array.isArray(slideId) ? slideId : [slideId];
      const deleteSlidesIndex = [];
      for (let i = 0; i < slidesId.length; i++) {
        const index = state.slides.findIndex((item) => item.id === slidesId[i]);
        deleteSlidesIndex.push(index);
      }
      let newIndex = Math.min(...deleteSlidesIndex);
      const maxIndex = state.slides.length - slidesId.length - 1;
      if (newIndex > maxIndex) newIndex = maxIndex;
      state.slideIndex = newIndex;
      state.slides = state.slides.filter((item) => !slidesId.includes(item.id));
      state.currentSlide = () => state.slides[state.slideIndex];
      return state;
    });
  },

  addElement(element: PPTElement | PPTElement[]) {
    set((state) => {
      const elements = Array.isArray(element) ? element : [element];
      const slides = state.slides;
      const slideIndex = state.slideIndex;
      const currentElements = slides[slideIndex].elements;
      slides[slideIndex] = {
        ...slides[slideIndex],
        elements: [...currentElements, ...elements],
      };
      return { slides };
    });
  },

  deleteElement(elementId: string | string[]) {
    set((state) => {
      const elementIdList = Array.isArray(elementId) ? elementId : [elementId];
      const slides = state.slides;
      const slideIndex = state.slideIndex;
      const currentSlideEls = slides[slideIndex].elements;
      const newEls = currentSlideEls.filter(
        (item) => !elementIdList.includes(item.id),
      );
      slides[slideIndex] = {
        ...slides[slideIndex],
        elements: newEls,
      };
      return { slides };
    });
  },

  updateElement(data: UpdateElementData) {
    const { id, props, slideId } = data;
    const elIdList = typeof id === 'string' ? [id] : id;
    const slides = get().slides;
    const slideIndex = slideId
      ? slides.findIndex((item) => item.id === slideId)
      : get().slideIndex;
    const slide = slides[slideIndex];
    const elements = slide.elements.map((el) => {
      return elIdList.includes(el.id) ? { ...el, ...props } : el;
    });
    slides[slideIndex].elements = elements as PPTElement[];
    set(() => ({ slides }));
  },
}));

export default useSlidesStore;
