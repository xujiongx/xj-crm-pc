import { Spin } from 'antd';
import { useEffect } from 'react';
import { useMaterialOperate } from './hooks';
import styles from './index.less';
import { CustomerConfig, ViewConfig } from './interface';
import Canvas from './modules/Canvas';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import useMainStore from './store';

interface Props<T> {
  config: CustomerConfig;
  preview?: boolean;
  loading?: boolean;
  elements?: T[];
  viewConfig?: ViewConfig;
  handleSave?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
}

const Decorate = <T,>(props: Props<T>) => {
  const {
    loading = false,
    config,
    preview = false,
    elements = [],
    viewConfig = { style: {} },
    handleSave,
  } = props;

  useEffect(() => {
    useMainStore.getState().setPreview(preview);
  }, [preview]);

  useEffect(() => {
    useMainStore.getState().setElements<T>(elements);
  }, [elements]);

  useEffect(() => {
    useMainStore.getState().setViewConfig(viewConfig);
  }, [viewConfig]);

  useEffect(() => {
    if (!config) return;
    useMainStore.getState().setConfig(config);
  }, [config]);

  const { configMaterial, add } = useMaterialOperate();

  return (
    <Spin spinning={loading}>
      <div className={styles.layout}>
        <Header className={styles['layout-header']} handleSave={handleSave} />
        <div className={styles['layout-content']}>
          <Material
            className={styles['layout-content-left']}
            configMaterial={configMaterial}
            preview={preview}
            add={add}
          />
          <div className={styles['layout-content-center']}>
            <Canvas<T> />
          </div>
          <Configure className={styles['layout-content-right']} />
        </div>
      </div>
    </Spin>
  );
};

export default Decorate;
