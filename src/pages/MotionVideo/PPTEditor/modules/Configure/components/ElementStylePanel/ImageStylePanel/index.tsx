import useHistorySnapshot from '@/pages/MotionVideo/PPTEditor/hooks/useHistorySnapshot';
import { PPTImageElement } from '@/pages/MotionVideo/PPTEditor/interface';
import { useMainStore } from '@/pages/MotionVideo/PPTEditor/store';
import useSlidesStore from '@/pages/MotionVideo/PPTEditor/store/slides';
import { InputNumber } from 'antd';
import ElementFlip from '../../common/ElementFlip';
import styles from './index.less';
import Divider from '../../Divider'
import ElementOutline from '../../common/ElementOutline'
import ElementShadow from '../../common/ElementShadow'

const ImageStylePanel = () => {
  const { add } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;

  const handleElementId = useMainStore((state) => state.activeElementId);

  const updateImage = (props: Partial<PPTImageElement>) => {
    if (!handleElement) return;
    useSlidesStore.getState().updateElement({ id: handleElementId, props });
    add();
  };

  return (
    <div className="image-style-panel">
      <div
        className={styles['origin-image']}
        style={{ backgroundImage: `url(${handleElement.src})` }}
      ></div>
      <ElementFlip />

      <div>裁剪图片</div>

      <div className="row">
        <div style={{ width: '40%' }}>圆角半径：</div>
        <InputNumber
          value={handleElement.radius || 0}
          onChange={(value) => updateImage({ radius: value || 0 })}
          // @update:value="value => updateImage({ radius: value })"
          style={{ width: '60%' }}
        />
      </div>
      <Divider />
      <div>着色（蒙版）：</div>
      <Divider />
      <div>启用滤镜：</div>
      <Divider />
      <ElementOutline />
      <Divider />
      <ElementShadow />
    </div>
  );
};

export default ImageStylePanel;
