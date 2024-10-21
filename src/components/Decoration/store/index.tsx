import { create } from 'zustand';
// import { ElementType } from '../interface';
import { uid } from '../utils';
import { Actions, State } from './interface';

const initialState: State = {
  preview: false,
  viewConfig: {
    style: {
      backgroundColor: '#f5f5f5',
    },
    pageConfig: {
      id: '',
      title: '',
    },
  },
  elements: [],
  selectedElement: undefined,
  config: {
    materials: [],
    elementsMap: [],
    configuresMap: [],
  },
};

const useMainStore = create<State & Actions>((set, get) => ({
  ...initialState,

  reset() {
    set(initialState);
  },

  setPreview(preview) {
    set({ preview });
  },

  setViewConfig(config) {
    set({ viewConfig: { ...initialState.viewConfig, ...config } });
  },

  setElements(elements) {
    set({ elements, selectedElement: undefined });
  },

  setSelectedElement(element?: any) {
    set({ selectedElement: element });
  },

  setConfig(config?: any) {
    set({ config });
  },

  updateViewStyle(style) {
    set({
      viewConfig: {
        ...get().viewConfig,
        style: {
          ...get().viewConfig.style,
          ...style,
        },
      },
    });
  },

  onUpElement(index) {
    const elements = get().elements;
    if (index > 0) {
      const temp = elements[index];
      elements[index] = elements[index - 1];
      elements[index - 1] = temp;
      set({ elements: [...elements], selectedElement: elements[index - 1] });
    }
  },

  onDownElement(index) {
    const elements = get().elements;
    if (index < elements.length - 1) {
      const element = elements[index];
      elements.splice(index, 1);
      elements.splice(index + 1, 0, element);
      set({ elements: [...elements], selectedElement: elements[index + 1] });
    }
  },

  onCopyElement(index) {
    const elements = get().elements;
    elements.splice(index, 0, { ...elements[index], id: uid() });
    set({ elements: [...elements], selectedElement: elements[index + 1] });
  },

  onDeleteElement(index) {
    const elements = get().elements;
    elements.splice(index, 1);
    set({
      elements: [...elements],
      selectedElement: index > 0 ? elements[index - 1] : elements[0],
    });
  },

  onUpdateElement(data: any) {
    const elements = get().elements;
    const elememt = get().selectedElement;
    const index = elements.findIndex((element) => element.id === elememt?.id);
    elements[index] = {
      ...elements[index],
      'component-props': {
        ...elememt?.['component-props'],
        ...data['component-props'],
      },
      'decorator-props': {
        ...elememt?.['decorator-props'],
        ...data['decorator-props'],
        style: {
          ...elememt?.['decorator-props']?.style,
          ...data['decorator-props'].style,
        },
      },
    };
    set({ elements: [...elements] });
  },

  onAddElement(element) {
    const elements = get().elements;
    const index = elements.findIndex(
      (element) => element.id === get().selectedElement?.id,
    );
    elements.splice(index + 1, 0, element);
    set({ elements: [...elements], selectedElement: elements[index + 1] });
  },
}));

export default useMainStore;
