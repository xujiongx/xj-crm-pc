import { Emitter } from 'mitt';
import { MenuDataItem } from './index';

export type MicroStoreEvents = {
  /** 菜单点击事件 */
  'layout:menu:click': MenuDataItem;
};

export interface MicroStoreType {
  emitter: Emitter<MicroStoreEvents>;
}
