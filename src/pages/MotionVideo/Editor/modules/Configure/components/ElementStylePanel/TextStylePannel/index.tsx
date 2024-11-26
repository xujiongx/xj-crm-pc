import React, { useState, useEffect } from 'react';
import { ColorPicker } from 'antd';
import {
  ColumnHeightOutlined,
  VerticalAlignTopOutlined,
  ColumnWidthOutlined
} from '@ant-design/icons';
import Divider from '../../Divider/index'
import RichTextBase from '../../RichTextBase/index'
import Select from '../../Select';
import useMainStore from '@/pages/MotionVideo/Editor/store/main';
import useSlidesStore from '@/pages/MotionVideo/Editor/store/slides';
import { PPTTextElement } from '@/pages/MotionVideo/Editor/interface';
import useHistorySnapshot from '@/pages/MotionVideo/Editor/store/snapshot';
import ActionIcon from '../../../../Canvas/components/ActionIcon';
import './index.less';
import emitter, { EmitterEvents, type RichTextAction } from '@/pages/MotionVideo/Editor/utils/emitter';


const TextStylePanel = () => {
  const handleElementId = useMainStore((store) => store.activeElementId);
  const handleElement = useSlidesStore((store) => store.activeElements)()?.[0];
  const slidesUpdateElement = useSlidesStore((store) => store.updateElement);

  const addHistorySnapshot = useHistorySnapshot((store) => store.add);


  const [fill, setFill] = useState('#000');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpace, setWordSpace] = useState(0);
  const [paragraphSpace, setParagraphSpace] = useState(5);

  const presetStyles = [
    {
      label: '大标题',
      style: { fontSize: '26px', fontWeight: 700 },
      cmd: [
        { command: 'clear' },
        { command: 'bold' },
        { command: 'fontsize', value: '66px' },
        { command: 'align', value: 'center' },
      ],
    },
    {
      label: '小标题',
      style: { fontSize: '22px', fontWeight: 700 },
      cmd: [
        { command: 'clear' },
        { command: 'bold' },
        { command: 'fontsize', value: '40px' },
        { command: 'align', value: 'center' },
      ],
    },
    {
      label: '正文',
      style: { fontSize: '20px' },
      cmd: [{ command: 'clear' }, { command: 'fontsize', value: '20px' }],
    },
    {
      label: '正文[小]',
      style: { fontSize: '18px' },
      cmd: [{ command: 'clear' }, { command: 'fontsize', value: '18px' }],
    },
    {
      label: '注释 1',
      style: { fontSize: '16px', fontStyle: 'italic' },
      cmd: [
        { command: 'clear' },
        { command: 'fontsize', value: '16px' },
        { command: 'em' },
      ],
    },
    {
      label: '注释 2',
      style: { fontSize: '16px', textDecoration: 'underline' },
      cmd: [
        { command: 'clear' },
        { command: 'fontsize', value: '16px' },
        { command: 'underline' },
      ],
    },
  ];

  useEffect(() => {
    const updateValues = () => {
      if (!handleElement || handleElement.type !== 'text') return;

      setFill(handleElement.fill || '#fff');
      setLineHeight(handleElement.lineHeight || 1.5);
      setWordSpace(handleElement.wordSpace || 0);
      setParagraphSpace(handleElement.paragraphSpace === undefined ? 5 : handleElement.paragraphSpace);
      // emitter.emit(EmitterEvents.SYNC_RICH_TEXT_ATTRS_TO_STORE);
    };

    updateValues();

  }, [handleElement]);

  const updateElement = (props: Partial<PPTTextElement>) => {
    slidesUpdateElement({ id: handleElementId, props });
    addHistorySnapshot();
  };

  const lineHeightOptions = [0.9, 1.0, 1.15, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0];
  const wordSpaceOptions = [0, 1, 2, 3, 4, 5, 6, 8, 10];
  const paragraphSpaceOptions = [0, 5, 10, 15, 20, 25, 30, 40, 50, 80];

  // 发送富文本设置命令（批量）
  const emitBatchRichTextCommand = (action: RichTextAction[]) => {
    emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action, target: handleElementId });
  };

  return (
    <div className="text-style-panel">
      <div className="preset-style">
        {presetStyles.map((item) => (
          <div
            key={item.label}
            className="preset-style-item"
            style={item.style}
            onClick={() => emitBatchRichTextCommand(item.cmd)}
          >
            {item.label}
          </div>
        ))}
      </div>

      <Divider />
      <RichTextBase />
      <Divider />

      <div className="row">
        <div style={{ width: '40%' }}>行间距：</div>
        <Select
          style={{ width: '60%' }}
          value={lineHeight}
          onChange={(value) => updateElement({ lineHeight: value as number })}
          options={lineHeightOptions.map(item => ({
            label: item + '倍', value: item
          }))}

        >
          <ActionIcon
            icon={<ColumnHeightOutlined />} />
        </Select>
      </div>
      <div className="row">
        <div style={{ width: '40%' }}>段间距：</div>
        <Select
          style={{ width: '60%' }}
          value={paragraphSpace}
          onChange={(value) => updateElement({ paragraphSpace: value as number })}
          options={paragraphSpaceOptions.map(item => ({
            label: item + 'px', value: item
          }))}

        >
          <ActionIcon
            icon={<VerticalAlignTopOutlined />} />
        </Select>

      </div>
      <div className="row">
        <div style={{ width: '40%' }}>字间距：</div>
        <Select
          style={{ width: '60%' }}
          value={wordSpace}
          onChange={(value) => updateElement({ wordSpace: value as number })}
          options={wordSpaceOptions.map(item => ({
            label: item + 'px', value: item
          }))}

        >
          <ActionIcon
            icon={<ColumnWidthOutlined />} />
        </Select>

      </div>
      <div className="row">
        <div style={{ width: '40%' }}>文本框填充：</div>
        <ColorPicker value={fill} onChange={(value) => updateElement({ fill: value.toRgbString() })} />
      </div>

      <Divider />
    </div>
  );
};

export default TextStylePanel;
