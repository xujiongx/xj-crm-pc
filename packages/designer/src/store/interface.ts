import { ElementType, ViewConfig } from '../interface';

export type State = {
  preview: boolean;
  viewConfig: ViewConfig;
  elements: ElementType[];
  selectedElement?: ElementType;
  config: any;
};

export type Actions = {
  reset: () => void;
  setPreview: (preview: boolean) => void;
  setViewConfig: (config: ViewConfig) => void;
  setElements: (elements: ElementType[]) => void;
  setSelectedElement: (element?: ElementType) => void;
  updateViewStyle: (style: React.CSSProperties) => void;
  onUpElement: (index: number) => void;
  onDownElement: (index: number) => void;
  onCopyElement: (index: number) => void;
  onDeleteElement: (index: number) => void;
  onAddElement: (element: ElementType) => void;
  onUpdateElement: (props: any) => void;
  setConfig: (props: any) => void;
};
