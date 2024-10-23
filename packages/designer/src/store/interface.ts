import { ViewConfig } from '../interface';

export type State<T> = {
  preview: boolean;
  viewConfig: ViewConfig;
  elements: Array<T>;
  selectedElement?: T;
  config: any;
};

export type Actions = {
  reset: () => void;
  setPreview: (preview: boolean) => void;
  setViewConfig: (config: ViewConfig) => void;
  setElements: <T>(elements: Array<T>) => void;
  setSelectedElement: <T>(element?: T) => void;
  updateViewStyle: (style: React.CSSProperties) => void;
  onUpElement: (index: number) => void;
  onDownElement: (index: number) => void;
  onCopyElement: (index: number) => void;
  onDeleteElement: (index: number) => void;
  onAddElement: <T>(element: T) => void;
  onUpdateElement: (props: any) => void;
  setConfig: (props: any) => void;
};
