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
  value?: {
    elements?: T[];
    viewConfig?: ViewConfig;
  };
  onChange?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
  handleSave?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
  handlePublic?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
}

const Decorate = <T,>(props: Props<T>) => {
  const {
    loading = false,
    config,
    preview = false,
    value = { elements: [], viewConfig: { style: {} } },
    handleSave,
    handlePublic,
    onChange,
  } = props;

  const {
    elements,
    viewConfig = {
      style: {},
    },
  } = value;

  useEffect(() => {
    useMainStore.getState().setPreview(preview);
  }, [preview]);

  useEffect(() => {
    // TODO: 样式待优化
    if (!elements) return;
    useMainStore.getState().setElements(elements as ElementType[]);
  }, [elements]);

  useEffect(() => {
    if (!viewConfig) return;
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

  const curElements = useMainStore((store) => store.elements);
  const curViewConfig = useMainStore((store) => store.viewConfig);

  useEffect(() => {
    onChange?.({ elements: curElements, viewConfig: curViewConfig });
  }, [curElements, curViewConfig]);

  return (
    <Spin spinning={loading}>
      <div
        className={styles.layout}
        style={{
          ...config?.layoutStyles,
        }}
      >
        {config?.headerRender ? (
          <config.headerRender />
        ) : (
          <Header
            className={styles['layout-header']}
            handleSave={handleSave}
            handlePublic={handlePublic}
          />
        )}
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
