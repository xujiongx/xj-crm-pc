import Decoration from '../Decoration';
import { DesignerConfig } from './config/index';
import { ElementType, ViewConfig } from './interface';

interface Props<T> {
  preview?: boolean;
  system?: boolean;
  loading?: boolean;
  elements?: T[];
  viewConfig?: ViewConfig;
  handleSave?: (data: { elements: T[]; viewConfig: ViewConfig }) => void;
}

const Designer = (props: Props<ElementType>) => {
  return <Decoration<ElementType> {...props} config={DesignerConfig} />;
};

export default Designer;
