import Decoration from '@aicc/designer';
import { ElementType } from '@aicc/designer/es/interface';
import { DesignerConfig } from './config/index';
import { CustomerElementType, ViewConfig } from './interface';

interface Props<T> {
  preview?: boolean;
  system?: boolean;
  loading?: boolean;
  elements?: T[];
  viewConfig?: ViewConfig;
  handleSave?: (data: { elements: T[]; viewConfig: ViewConfig }) => void;
}

const Designer = (props: Props<ElementType & CustomerElementType>) => {
  return (
    <Decoration<ElementType & CustomerElementType>
      {...props}
      config={DesignerConfig}
    />
  );
};

export default Designer;
