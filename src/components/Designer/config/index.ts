import { getToken, stringifySignatureWithUrl } from '@/utils';
import { CustomerConfig } from '@aicc/designer/es/interface';
import { ConfigTypeMap } from './configure';
import { ElementTypeMap } from './element';
import { Materials } from './material';

const uploadConfig = {
  headers: { 'X-Access-Token': getToken()!, mode: 'sign_test' },
  action: stringifySignatureWithUrl('/scp/exam/file/common/upload'),
};

export const DesignerConfig: CustomerConfig = {
  materials: Materials,
  elementsMap: ElementTypeMap,
  configsMap: ConfigTypeMap,
  uploadConfig,
  // hidePageStyle: true,
  layoutStyles: {},
};