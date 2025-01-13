import actionSvg from '@/assets/avatar/action.svg';
import { ReactComponent as ClothSvg } from '@/assets/avatar/cloth.svg';
import { useControllableValue } from 'ahooks';
import { Empty } from 'antd';
import clsx from 'clsx';
import styles from './index.less';
import { getOuterClothColor } from './utils';

export type DigitalImageType = {
  /** 数字形象ID */
  id: string;
  /** 数字形象文本 */
  name: string;
  /** 数字形象图片 */
  url: string;
  /** 形象标签 */
  label?: string;
  /** 是否选中 0-否 1-是 */
  checked?: '0' | '1';
  /** 是否支持动作 0-否 1-是 */
  hasAction?: number;
  imageCode?: string;
  imageId?: string;
  /** 形象参数 */
  imageConfigParam?: string;
  /** 分辨率 */
  resolution?: string;
};

interface ImageGroupProps {
  options: Array<DigitalImageType>;
  disabled?: boolean;
}

const ImageGroup = ({ options, disabled, ...rest }: ImageGroupProps) => {
  const [value, onChange] = useControllableValue(rest);

  return (
    <div className={styles.listWrapper}>
      <div className={styles.list}>
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => !disabled && onChange(option.id, option)}
            className={clsx(styles.item, {
              [styles.active]: value === option.id,
            })}
          >
            <div className={styles.cover}>
              <img src={option.url} alt={option.name} />
              {option.resolution && (
                <div className={styles.resolutionWrapper}>
                  {option.resolution}
                </div>
              )}
            </div>
            <div className={styles.name} key={option.id}>
              <div>{option.name}</div>
              {option.hasAction ? <img src={actionSvg} /> : null}
            </div>
            <div className={styles.paramsWraper}>
              {option.label && (
                <div className={styles.label}>
                  <div className={styles.labelBg}>{option.label}</div>
                </div>
              )}
              {getOuterClothColor(option.imageConfigParam!) && (
                <ClothSvg
                  fill={getOuterClothColor(option.imageConfigParam!)}
                  style={{ width: 18 }}
                />
              )}
            </div>
            {/* {value === option.id && (
              <CheckCircleFilled className={styles.activeIcon} />
            )} */}
          </div>
        ))}
        {!options.length && (
          <Empty
            style={{ margin: '20px auto' }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无可用数字人形象"
          />
        )}
      </div>
    </div>
  );
};

export default ImageGroup;
