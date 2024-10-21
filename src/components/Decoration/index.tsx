import { Spin } from 'antd';
import { useEffect } from 'react';
import { useMaterialOperate } from './hooks';
import styles from './index.less';
import Canvas from './modules/Canvas';
import Configure from './modules/Configure';
import Header from './modules/Header';
import Material from './modules/Material';
import useMainStore from './store';

interface Props {
  config: any;
}

const Designer = (props: Props) => {
  const { config } = props;
  const loading = false;

  useEffect(() => {
    console.log(8881, config);
    if (!config) return;
    useMainStore.getState().setConfig(config);
  }, [config]);

  const { configMaterial, preview, add } = useMaterialOperate();

  console.log('🤛', configMaterial, preview);
  return (
    <Spin spinning={loading}>
      <div className={styles.layout}>
        <Header className={styles['layout-header']} />
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

export default Designer;
