import { Spin } from 'antd';
import { useEffect } from 'react';
import { DesignerConfig } from './config';
import { useMaterialOperate } from './hooks';
import styles from './index.less';
import { CustomerConfig, ElementType, ViewConfig } from './interface';
import Canvas from './modules/Canvas';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import useMainStore from './store';

interface Props<T> {
  config?: CustomerConfig;
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
    // TODO: 样式待优化
    useMainStore.getState().setElements(elements as ElementType[]);
  }, [elements]);

  useEffect(() => {
    useMainStore.getState().setViewConfig(viewConfig);
  }, [viewConfig]);

  useEffect(() => {
    // 外部没有传入配置，就使用默认配置
    if (!config) {
      useMainStore.getState().setConfig(DesignerConfig);
      return;
    }
    useMainStore.getState().setConfig(config);
  }, [config]);

  const { configMaterial, add } = useMaterialOperate();

  return (
    <Spin spinning={loading}>
      <div
        className={styles.layout}
        style={{
          ...config?.layoutStyles,
        }}
      >
        <Header className={styles['layout-header']} handleSave={handleSave} />
        <div className={styles['layout-content']}>
          <Material
            className={styles['layout-content-left']}
            configMaterial={configMaterial}
            preview={preview}
            add={add}
          />
          <div className={styles['layout-content-center']}>
            <Canvas />
          </div>
          <Configure className={styles['layout-content-right']} />
        </div>
      </div>
    </Spin>
  );
};

export default Decorate;
