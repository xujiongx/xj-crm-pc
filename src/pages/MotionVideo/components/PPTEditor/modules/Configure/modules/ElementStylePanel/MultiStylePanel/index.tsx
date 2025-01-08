import useHistorySnapshot from '@/pages/MotionVideo/components/PPTEditor/hooks/useHistorySnapshot';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { WEB_FONTS } from '@/pages/MotionVideo/config/font';
import {
  PPTElement,
  PPTElementOutline,
  TableCell,
} from '@/pages/MotionVideo/interface';
import emitter, { EmitterEvents } from '@/pages/MotionVideo/utils/emitter';
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BgColorsOutlined,
  ColumnWidthOutlined,
  FontSizeOutlined,
} from '@ant-design/icons';
import { FontSize, HighLight, Text } from '@icon-park/react';
import { ColorPicker, Divider, InputNumber } from 'antd';
import { useState } from 'react';
import ActionIcon from '../../../../Canvas/components/ActionIcon';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import Select from '../../../components/Select';
import SelectGroup from '../../../components/SelectGroup';
import TextColorButton from '../../../components/TextColorButton';
import styles from './index.less';

const fontSizeOptions = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '28px',
  '32px',
  '36px',
  '40px',
  '44px',
  '48px',
  '54px',
  '60px',
  '66px',
  '72px',
  '76px',
  '80px',
  '88px',
  '96px',
  '104px',
  '112px',
  '120px',
];

const MultiStylePanel = () => {
  const { addHistorySnapshot } = useHistorySnapshot();
  const sourceUpdateElement = useSlidesStore((store) => store.updateElement);

  const updateElement = (id: string, props: Partial<PPTElement>) => {
    // 假设我们有一个方法来更新元素
    sourceUpdateElement({ id, props });
    addHistorySnapshot();
  };

  const [fill, setFill] = useState('#fff');
  const activeElementList = useMainStore((store) => store.activeElementList)();

  // 批量修改填充色（表格元素为单元格填充、音频元素为图标颜色）
  const updateFill = (value: string) => {
    for (const el of activeElementList) {
      if (el.type === 'text' || el.type === 'shape' || el.type === 'chart')
        updateElement(el.id, { fill: value });

      if (el.type === 'table') {
        const data: TableCell[][] = JSON.parse(JSON.stringify(el.data));
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            const style = data[i][j].style || {};
            data[i][j].style = { ...style, backcolor: value };
          }
        }
        updateElement(el.id, { data });
      }

      if (el.type === 'audio') updateElement(el.id, { color: value });
    }
    setFill(value);
  };

  const [outline, setOutline] = useState<PPTElementOutline>({
    width: 0,
    color: '#fff',
    style: 'solid',
  });

  // 修改边框/线条样式
  const updateOutline = (outlineProps: Partial<PPTElementOutline>) => {
    for (const el of activeElementList) {
      if (
        el.type === 'text' ||
        el.type === 'image' ||
        el.type === 'shape' ||
        el.type === 'table' ||
        el.type === 'chart'
      ) {
        const outline = el.outline || {
          width: 2,
          color: '#000',
          style: 'solid',
        };
        const props = { outline: { ...outline, ...outlineProps } };
        updateElement(el.id, props);
      }

      if (el.type === 'line') updateElement(el.id, outlineProps);
    }
    setOutline({ ...outline, ...outlineProps });
  };

  // 修改文字样式
  const updateFontStyle = (command: string, value: string) => {
    for (const el of activeElementList) {
      if (el.type === 'text' || (el.type === 'shape' && el.text?.content)) {
        emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, {
          target: el.id,
          action: { command, value },
        });
      }
      if (el.type === 'table') {
        const data: TableCell[][] = JSON.parse(JSON.stringify(el.data));
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            const style = data[i][j].style || {};
            data[i][j].style = { ...style, [command]: value };
          }
        }
        updateElement(el.id, { data });
      }
      if (el.type === 'latex' && command === 'color') {
        updateElement(el.id, { color: value });
      }
    }
  };

  const richTextAttrs = useMainStore((store) => store.richTextAttrs);
  const availableFonts = useMainStore((store) => store.availableFonts);

  return (
    <div>
      <div className={styles['item']}>
        <div className={styles['label']}>填充颜色：</div>
        <div className={styles['value']}>
          <ColorPicker
            value={outline?.color}
            onChange={(value) => updateFill(value.toRgbString())}
          >
            <div
              className="colorPick-btn"
              style={{
                backgroundColor: fill,
                width: '100%',
              }}
            >
              <BgColorsOutlined className="colorPick-btn-icon" />
            </div>
          </ColorPicker>
        </div>
      </div>
      <Divider />
      <div>
        <div className={styles['item']}>
          <div className={styles['label']}>边框样式：</div>
          <div className={styles['value']}>
            <Select
              style={{
                width: '100%',
              }}
              value={outline.style || 'solid'}
              onChange={(value) => {
                updateOutline({
                  style: value as 'dashed' | 'solid' | 'dotted',
                });
              }}
              options={[
                { label: '实线边框', value: 'solid' },
                { label: '虚线边框', value: 'dashed' },
                { label: '点线边框', value: 'dotted' },
              ]}
            />
          </div>
        </div>

        <div className={styles['item']}>
          <div className={styles['label']}>边框颜色：</div>
          <div className={styles['value']}>
            <ColorPicker
              value={outline?.color}
              onChange={(value) =>
                updateOutline({ color: value.toRgbString() })
              }
            >
              <div
                className="colorPick-btn"
                style={{
                  backgroundColor: outline?.color,
                  width: '100%',
                }}
              >
                <BgColorsOutlined className="colorPick-btn-icon" />
              </div>
            </ColorPicker>
          </div>
        </div>

        <div className={styles['item']}>
          <div className={styles['label']}>边框粗细：</div>
          <div className={styles['value']}>
            <InputNumber
              min={0}
              max={30}
              value={outline?.width || 0}
              onChange={(value) => updateOutline({ width: value || 0 })}
              style={{
                width: '100%',
              }}
            />
          </div>
        </div>
        <Divider />
        <SelectGroup className="row">
          <Select
            className="font-select"
            style={{ width: '60%' }}
            value={richTextAttrs.fontname}
            onChange={(value) => {
              updateFontStyle('fontname', value as string);
            }}
            options={[...availableFonts, ...WEB_FONTS]}
            isHasLabelFamily
          >
            <ActionIcon icon={<FontSize />} />
          </Select>
          <Select
            style={{ width: '40%' }}
            value={richTextAttrs.fontsize}
            onChange={(value) => updateFontStyle('fontsize', value as string)}
            options={fontSizeOptions.map((item) => ({
              label: item,
              value: item,
            }))}
          >
            <ActionIcon icon={<FontSizeOutlined />} />
          </Select>
        </SelectGroup>

        <ButtonGroup className="row" passive>
          <TextColorButton style={{ width: '30%' }} color={richTextAttrs.color}>
            <ColorPicker
              value={richTextAttrs.color}
              onChange={(value) =>
                updateFontStyle('color', value.toRgbString())
              }
            >
              <ActionIcon icon={<Text />} tooltip="文字颜色" />
            </ColorPicker>
          </TextColorButton>

          <TextColorButton
            style={{ width: '30%' }}
            color={richTextAttrs.backcolor}
          >
            <ColorPicker
              value={richTextAttrs.backcolor}
              onChange={(value) =>
                updateFontStyle('backcolor', value.toRgbString())
              }
            >
              <ActionIcon icon={<HighLight />} tooltip="文字高亮" />
            </ColorPicker>
          </TextColorButton>

          <Button
            className="font-size-btn"
            style={{ width: '20%' }}
            onClick={() => updateFontStyle('fontsize-add', '2')}
          >
            <ActionIcon icon={<FontSize />} tooltip="增大字号" />+
          </Button>

          <Button
            last
            className="font-size-btn"
            style={{ width: '20%' }}
            onClick={() => updateFontStyle('fontsize-reduce', '2')}
          >
            <ActionIcon icon={<FontSize />} tooltip="减少字号" />-
          </Button>
        </ButtonGroup>

        <ButtonGroup className="row">
          <Button
            onClick={() => {
              updateFontStyle('align', 'left');
            }}
            style={{ flex: 1 }}
          >
            <ActionIcon icon={<AlignLeftOutlined />} tooltip="左对齐" />
          </Button>
          <Button
            onClick={() => {
              updateFontStyle('align', 'center');
            }}
            style={{ flex: 1 }}
          >
            <ActionIcon icon={<AlignCenterOutlined />} tooltip="居中" />
          </Button>
          <Button
            onClick={() => {
              updateFontStyle('align', 'right');
            }}
            style={{ flex: 1 }}
          >
            <ActionIcon icon={<AlignRightOutlined />} tooltip="右对齐" />
          </Button>
          <Button
            onClick={() => {
              updateFontStyle('align', 'justify');
            }}
            style={{ flex: 1 }}
          >
            <ActionIcon icon={<ColumnWidthOutlined />} tooltip="两端对齐" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default MultiStylePanel;
