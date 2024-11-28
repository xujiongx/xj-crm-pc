import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { PPTAnimation, PPTElement, SlideItem, SlideTheme } from '../interface';
import { runAnimation } from '../utils/animation';
import useMainStore from './main';
import useSnapshotStore from './snapshot';

interface FormatedAnimation {
  animations: PPTAnimation[];
  autoNext: boolean;
}

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
  currentSlideAnimations: () => PPTAnimation[];
  formatedAnimations: () => FormatedAnimation[];
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
  addAnimation: (data: any) => void;
  deleteAnimation: (id: string) => void;
  updateAnimation: (id: string, data: any) => void;
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

  currentSlideAnimations: () => {
    const currentSlide = get().currentSlide();
    if (!currentSlide?.animations) return [];

    const els = currentSlide.elements;
    const elIds = els.map((el) => el.id);
    return currentSlide.animations.filter((animation) =>
      elIds.includes(animation.elId),
    );
  },
  formatedAnimations: () => {
    const currentSlide = get().currentSlide();
    if (!currentSlide?.animations) return [];

    const els = currentSlide.elements;
    const elIds = els.map((el) => el.id);
    const animations = currentSlide.animations.filter((animation) =>
      elIds.includes(animation.elId),
    );

    const formatedAnimations: FormatedAnimation[] = [];
    for (const animation of animations) {
      if (animation.trigger === 'click' || !formatedAnimations.length) {
        formatedAnimations.push({ animations: [animation], autoNext: false });
      } else if (animation.trigger === 'meantime') {
        const last = formatedAnimations[formatedAnimations.length - 1];
        last.animations = last.animations.filter(
          (item) => item.elId !== animation.elId,
        );
        last.animations.push(animation);
        formatedAnimations[formatedAnimations.length - 1] = last;
      } else if (animation.trigger === 'auto') {
        const last = formatedAnimations[formatedAnimations.length - 1];
        last.autoNext = true;
        formatedAnimations[formatedAnimations.length - 1] = last;
        formatedAnimations.push({ animations: [animation], autoNext: false });
      }
    }
    return formatedAnimations;
  },

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

      const animations = elements.map((el) => {
        return {
          id: nanoid(10),
          elId: el.id,
          effect: 'fadeIn',
          start: 0,
          end: 1,
          name: '弹入',
          type: 'in' as const,
        };
      });

      const slides = state.slides;
      const slideIndex = state.slideIndex;
      const currentElements = slides[slideIndex].elements;
      const currentAnimations = slides[slideIndex].animations || [];
      slides[slideIndex] = {
        ...slides[slideIndex],
        elements: [...currentElements, ...elements],
        animations: [...currentAnimations, ...animations],
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

  addAnimation: (data: any) => {
    const handleElementId = useMainStore.getState().activeElementId;

    const animations: PPTAnimation[] = JSON.parse(
      JSON.stringify(get().currentSlideAnimations()),
    );
    animations.push({
      id: nanoid(10),
      elId: handleElementId,
      ...data,
    });
    console.log('👨‍👨‍👧', animations);
    get().updateSlide({ animations });
    useSnapshotStore.getState().add();

    setTimeout(() => {
      runAnimation(handleElementId, data.effect, data.end - data.start);
    }, 0);
  },

  deleteAnimation: (id: string) => {
    const animations = get()
      .currentSlideAnimations()
      .filter((item) => item.id !== id);
    get().updateSlide({ animations });

    useSnapshotStore.getState().add();
  },

  updateAnimation: (id: string, data: any) => {
    const animations = get()
      .currentSlideAnimations()
      .map((item) => {
        if (item.id === id) return { ...item, ...data };
        return item;
      });
    get().updateSlide({ animations });
    useSnapshotStore.getState().add();
  },
}));

export default useSlidesStore;
