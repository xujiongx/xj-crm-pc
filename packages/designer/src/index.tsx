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

/**
 * 定义一个 Props 接口，用于描述组件的属性
 *
 * @interface Props
 * @template T 元素类型
 * @property {CustomerConfig} [config] - 客户配置
 * @property {boolean} [preview] - 是否预览
 * @property {boolean} [loading] - 是否加载中
 * @property {value} [value] - 值
 * @property {onChange} [onChange] - 变化时的回调函数
 * @property {handleSave} [handleSave] - 保存时的回调函数（默认顶部）
 * @property {handlePublic} [handlePublic] - 发布时的回调函数（默认顶部）
 */
interface Props<T> {
  // 可选的 CustomerConfig 类型的配置对象
  config?: CustomerConfig;
  // 可选的布尔类型的预览标志，默认值为 false
  preview?: boolean;
  // 可选的布尔类型的加载中标志，默认值为 false
  loading?: boolean;
  // 可选的 value 对象，包含 elements 和 viewConfig 两个可选属性
  value?: {
    // 可选的 T 类型的元素数组
    elements?: T[];
    // 可选的 ViewConfig 类型的视图配置
    viewConfig?: ViewConfig;
  };
  // 可选的回调函数，当 elements 或 viewConfig 发生变化时调用
  onChange?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
  // 可选的回调函数，当保存操作发生时调用（默认顶部）
  handleSave?: (data: { elements: any[]; viewConfig: ViewConfig }) => void;
  // 可选的回调函数，当发布操作发生时调用（默认顶部）
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
