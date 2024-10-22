// import { uid } from '@aicc/shared';
import { Typography } from 'antd';
import clsx from 'clsx';
// import useMainStore from '../../store';
import styles from './index.less';
import MaterialItem from './item';

interface MaterialProps {
  className: string;
  preview?: boolean;
  configMaterial: any[];
  add: (item: any) => void;
}

const Material = (props: MaterialProps) => {
  const { className, configMaterial, preview = false, add } = props;

  return (
    <div className={clsx(className, styles.material)}>
      {configMaterial?.map((material) => (
        <div key={material.title}>
          <Typography.Title level={5}>{material.title}</Typography.Title>
          <div className={styles.list} style={{ marginBottom: '30px' }}>
            {material.items?.map((item) => (
              <div className={styles['item-wrapper']} key={item.component}>
                <MaterialItem
                  disabled={preview}
                  onClick={() => add(item)}
                  title={item.title}
                  component={item.component}
                  icon={item?.icon}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Material;
