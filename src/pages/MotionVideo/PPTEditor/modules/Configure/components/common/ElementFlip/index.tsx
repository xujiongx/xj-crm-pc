import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import {
  ImageOrShapeFlip,
  PPTImageElement,
} from '@/pages/MotionVideo/PPTEditor/interface';
import { useSlidesStore } from '@/pages/MotionVideo/PPTEditor/store';
import { BoldOutlined } from '@ant-design/icons';
import ActionIcon from '../../../../Canvas/components/ActionIcon';
import CheckboxButton from '../../CheckboxButton';
import SelectGroup from '../../SelectGroup';
import styles from './index.less';

const ElementFlip = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;

  const updateFlip = (flipProps: ImageOrShapeFlip) => {
    if (!handleElement) return;
    useSlidesStore
      .getState()
      .updateElement({ id: handleElement.id, props: flipProps });
    add();
  };

  return (
    <div className="element-flip">
      <SelectGroup className={styles['row']}>
        <CheckboxButton
          style={{ flex: 1, BorderRadius: '0' }}
          checked={handleElement.flipH}
          onClick={() => updateFlip({ flipH: !handleElement.flipH })}
        >
          <ActionIcon icon={<BoldOutlined />} />
          水平翻转
        </CheckboxButton>
        <CheckboxButton
          style={{ flex: 1, BorderRadius: '0' }}
          checked={handleElement.flipV}
          onClick={() => updateFlip({ flipV: !handleElement.flipV })}
        >
          <ActionIcon icon={<BoldOutlined />} />
          垂直翻转
        </CheckboxButton>
      </SelectGroup>
    </div>
  );
};

export default ElementFlip;