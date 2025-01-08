import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import { useMainStore } from '@/pages/MotionVideo/components/PPTEditor/store';
import useSlidesStore from '@/pages/MotionVideo/components/PPTEditor/store/slides';
import { CLIPPATHS } from '@/pages/MotionVideo/config/imageClip';
import {
  PPTImageElement,
  SlideBackground,
} from '@/pages/MotionVideo/interface';
import { DownOutlined, ScissorOutlined } from '@ant-design/icons';
import { Theme } from '@icon-park/react';
import { InputNumber, Popover } from 'antd';
import ActionIcon from '../../../../Canvas/components/ActionIcon';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import Divider from '../../../components/Divider';
import ElementColorMask from '../../../components/common/ElementColorMask';
import ElementFilter from '../../../components/common/ElementFilter';
import ElementFlip from '../../../components/common/ElementFlip';
import ElementOutline from '../../../components/common/ElementOutline';
import ElementShadow from '../../../components/common/ElementShadow';
import { ratioClipOptions } from './const';
import styles from './index.less';

const ImageStylePanel = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const handleElement = useSlidesStore(
    (store) => store.activeElements,
  )()[0] as PPTImageElement;

  const mainStore = useMainStore.getState();

  const handleElementId = useMainStore((state) => state.activeElementId);

  const updateImage = (props: Partial<PPTImageElement>) => {
    if (!handleElement) return;
    useSlidesStore.getState().updateElement({ id: handleElementId, props });
    addHistorySnapshot();
  };

  const shapeClipPathOptions = Object.keys(CLIPPATHS).map((item) => ({
    key: item,
    item: CLIPPATHS[item],
  }));

  // 打开自由裁剪
  const clipImage = () => {
    mainStore.setClipingImageElementId(handleElementId);
  };

  // 获取原始图片的位置大小
  const getImageElementDataBeforeClip = () => {
    const _handleElement = handleElement as PPTImageElement;

    // 图片当前的位置大小和裁剪范围
    const imgWidth = _handleElement.width;
    const imgHeight = _handleElement.height;
    const imgLeft = _handleElement.left;
    const imgTop = _handleElement.top;
    const originClipRange: [[number, number], [number, number]] =
      _handleElement.clip
        ? _handleElement.clip.range
        : [
            [0, 0],
            [100, 100],
          ];

    const originWidth =
      imgWidth / ((originClipRange[1][0] - originClipRange[0][0]) / 100);
    const originHeight =
      imgHeight / ((originClipRange[1][1] - originClipRange[0][1]) / 100);
    const originLeft = imgLeft - originWidth * (originClipRange[0][0] / 100);
    const originTop = imgTop - originHeight * (originClipRange[0][1] / 100);

    return {
      originClipRange,
      originWidth,
      originHeight,
      originLeft,
      originTop,
    };
  };

  // 预设裁剪
  const presetImageClip = (shape: string, ratio = 0) => {
    const _handleElement = handleElement as PPTImageElement;

    const {
      originClipRange,
      originWidth,
      originHeight,
      originLeft,
      originTop,
    } = getImageElementDataBeforeClip();

    // 纵横比裁剪（形状固定为矩形）
    if (ratio) {
      const imageRatio = originHeight / originWidth;

      const min = 0;
      const max = 100;
      let range: [[number, number], [number, number]];

      if (imageRatio > ratio) {
        const distance = ((1 - ratio / imageRatio) / 2) * 100;
        range = [
          [min, distance],
          [max, max - distance],
        ];
      } else {
        const distance = ((1 - imageRatio / ratio) / 2) * 100;
        range = [
          [distance, min],
          [max - distance, max],
        ];
      }
      updateImage({
        clip: { ..._handleElement.clip, shape, range },
        left: originLeft + originWidth * (range[0][0] / 100),
        top: originTop + originHeight * (range[0][1] / 100),
        width: (originWidth * (range[1][0] - range[0][0])) / 100,
        height: (originHeight * (range[1][1] - range[0][1])) / 100,
      });
    }
    // 形状裁剪（保持当前裁剪范围）
    else {
      const clipData = {
        ..._handleElement.clip,
        shape,
        range: originClipRange,
      };
      let props: Partial<PPTImageElement> = { clip: clipData };
      if (shape === 'rect') props = { clip: clipData, radius: 0 };
      updateImage(props);
    }
    clipImage();
  };

  const updateSlide = useSlidesStore((store) => store.updateSlide);
  const currentSlide = useSlidesStore((store) => store.currentSlide());

  // 将图片设置为背景
  const setBackgroundImage = () => {
    const _handleElement = handleElement as PPTImageElement;

    const background: SlideBackground = {
      ...currentSlide.background,
      type: 'image',
      image: _handleElement.src,
      imageSize: 'cover',
    };
    updateSlide({ background });
    addHistorySnapshot();
  };

  return (
    <div className="image-style-panel">
      <div
        className={styles['origin-image']}
        style={{ backgroundImage: `url(${handleElement.src})` }}
      ></div>

      <ElementFlip />

      <ButtonGroup passive className={styles['row']}>
        <Button
          first
          style={{ flex: 3 }}
          type={'default'}
          onClick={() => {
            clipImage();
          }}
        >
          <ScissorOutlined style={{ marginRight: '4px' }} />
          裁剪图片
        </Button>
        <Popover
          trigger="click"
          placement="bottom"
          content={
            <div className={styles['clip']}>
              <div className={styles['title']}>按形状：</div>
              <div className={styles['shape-clip']}>
                {shapeClipPathOptions.map((item) => (
                  <div
                    key={item.key}
                    className={styles['shape-clip-item']}
                    onClick={() => {
                      presetImageClip(item.key);
                    }}
                  >
                    <div
                      className={styles['shape']}
                      style={{ clipPath: item.item.style }}
                    ></div>
                  </div>
                ))}
              </div>

              <div>
                {ratioClipOptions.map((item) => (
                  <div key={item.label}>
                    <div className={styles['title']}>按{item.label}:</div>
                    <ButtonGroup className={styles['row']}>
                      {item.children.map((item) => (
                        <Button
                          style={{ flex: 1 }}
                          key={item.key}
                          onClick={() => {
                            presetImageClip('rect', item.ratio);
                          }}
                        >
                          {item.key}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="action-btn" style={{ flex: 1 }}>
            <ActionIcon icon={<DownOutlined />} />
          </div>
        </Popover>
      </ButtonGroup>

      <div className={styles['item']}>
        <div className={styles['label']}>圆角半径：</div>
        <div className={styles['value']}>
          <InputNumber
            value={handleElement.radius || 0}
            onChange={(value) => updateImage({ radius: value || 0 })}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <Divider />
      <ElementColorMask />
      <Divider />
      <ElementFilter />
      <Divider />
      <ElementOutline />
      <Divider />
      <ElementShadow />
      <Divider />
      <Button style={{ width: '100%' }} onClick={() => setBackgroundImage()}>
        <Theme />
        设为背景
      </Button>
    </div>
  );
};

export default ImageStylePanel;
