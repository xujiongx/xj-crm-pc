import Decoration from '../Decoration';
import { ElementType, ViewConfig } from './interface';
import DesignConfig from './utils/index';

interface Props<T> {
  preview?: boolean;
  system?: boolean;
  loading?: boolean;
  elements?: Array<T>;
  viewConfig?: ViewConfig;
  onBack?: () => void;
  onUpdate?: (elements: Array<T>) => Promise<any> | undefined;
  onPublish?: () => Promise<any>;
}

const Designer = (props: Props<ElementType>) => {
  return <Decoration {...props} config={DesignConfig} />;
};

export default Designer;
