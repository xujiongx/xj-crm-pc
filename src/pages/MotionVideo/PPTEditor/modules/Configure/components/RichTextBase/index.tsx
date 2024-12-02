import {
  FontSizeOutlined,
  BgColorsOutlined,
  BoldOutlined,
  ItalicOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  HighlightOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  CodeOutlined,
  EditOutlined,
  CloseOutlined,
  FormatPainterOutlined,
  LinkOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
  ColumnWidthOutlined,
  UnorderedListOutlined,
  DownOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import React, { useState } from 'react';
import { message, ColorPicker, Popover } from 'antd'
import useMainStore from '../../../../store/main';
import emitter, { EmitterEvents } from '../../../../utils/emitter';
import { WEB_FONTS } from '../../../../config/font';
import useTextFormatPainter from '../../../../hooks/useTextFormatPainter';
import ActionIcon from '../../../Canvas/components/ActionIcon';

import TextColorButton from '../TextColorButton/index';
import CheckboxButton from '../CheckboxButton/index';
// import ColorPicker from '../ColorPicker/index';
import Input from '../Input/index';
import Button from '../Button/index';
import ButtonGroup from '../ButtonGroup/index';
import Select from '../Select/index';
import SelectGroup from '../SelectGroup/index';
import Divider from '../Divider/index';
import './index.less';

const RichTextBase = () => {
  const richTextAttrs = useMainStore((store) => store.richTextAttrs);
  const availableFonts = useMainStore((store) => store.availableFonts);
  const textFormatPainter = useMainStore((store) => store.textFormatPainter);
  const activeElementId = useMainStore((store) => store.activeElementId);

  const { toggleTextFormatPainter } = useTextFormatPainter();

  const fontSizeOptions = [
    '12px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '32px',
    '36px', '40px', '44px', '48px', '54px', '60px', '66px', '72px', '76px',
    '80px', '88px', '96px', '104px', '112px', '120px',
  ];

  const emitRichTextCommand = (command: string, value?: string) => {
    emitter.emit(EmitterEvents.RICH_TEXT_COMMAND, { action: { command, value }, target: activeElementId });
  };

  const bulletListStyleTypeOption = ['disc', 'circle', 'square'];
  const orderedListStyleTypeOption = ['decimal', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'lower-greek'];

  const [link, setLink] = useState('');


  const updateLink = (link?: string) => {
    const linkRegExp = /^(https?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
    if (!link || !linkRegExp.test(link)) {
      return message.error('不是正确的网页链接地址');
    }

    emitRichTextCommand('link', link);
  };

  const removeLink = () => {
    emitRichTextCommand('link');
  };

  return (
    <div className="rich-text-base">
      <SelectGroup className="row">
        <Select
          className="font-select"
          style={{ width: '60%' }}
          value={richTextAttrs.fontname}
          onChange={(value) => { emitRichTextCommand('fontname', value as string) }}
          options={[...availableFonts, ...WEB_FONTS]}
        >
          <ActionIcon
            icon={< HighlightOutlined />} />
        </Select>
        <Select
          style={{ width: '40%' }}
          value={richTextAttrs.fontsize}
          onChange={(value) => emitRichTextCommand('fontsize', value as string)}
          options={fontSizeOptions.map((item) => ({
            label: item,
            value: item,
          }))}
        >
          <ActionIcon icon={< FontSizeOutlined />} />
        </Select>
      </SelectGroup>

      <ButtonGroup className="row" passive>

        <TextColorButton
          style={{ width: '30%' }}
          color={richTextAttrs.color}
        >
          <ColorPicker value={richTextAttrs.color} onChange={(value) => emitRichTextCommand('color', value.toRgbString())} >
            <ActionIcon icon={<FontSizeOutlined />} tooltip="文字颜色" />
          </ColorPicker>
        </TextColorButton>

        <TextColorButton
          style={{ width: '30%' }}
          color={richTextAttrs.backcolor}
        >
          <ColorPicker value={richTextAttrs.backcolor} onChange={(value) => emitRichTextCommand('backcolor', value.toRgbString())} >
            <ActionIcon icon={<BgColorsOutlined />} tooltip="文字高亮" />
          </ColorPicker>
        </TextColorButton>

        <Button
          className="font-size-btn"
          style={{ width: '20%' }}
          onClick={() => emitRichTextCommand('fontsize-add')}
        >
          <ActionIcon icon={<ZoomInOutlined />} tooltip="增大字号" />+
        </Button>


        <Button
          last
          className="font-size-btn"
          style={{ width: '20%' }}
          onClick={() => emitRichTextCommand('fontsize-reduce')}
        >
          <ActionIcon icon={<ZoomOutOutlined />} tooltip="减少字号" />-
        </Button>
      </ButtonGroup>

      <ButtonGroup className="row">

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.bold}
          onClick={() => emitRichTextCommand('bold')}
        >
          <ActionIcon icon={<BoldOutlined />} tooltip="加粗" />
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.em}
          onClick={() => emitRichTextCommand('em')}
        >
          <ActionIcon icon={<ItalicOutlined />} tooltip="斜体" />
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.underline}
          onClick={() => emitRichTextCommand('underline')}
        >
          <ActionIcon icon={<UnderlineOutlined />} tooltip="下划线" />
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.strikethrough}
          onClick={() => emitRichTextCommand('strikethrough')}
        >
          <ActionIcon icon={<StrikethroughOutlined />} tooltip="删除线" />
        </CheckboxButton>

      </ButtonGroup>

      <ButtonGroup className="row">

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.superscript}
          onClick={() => emitRichTextCommand('superscript')}
        >
          A²
        </CheckboxButton>


        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.subscript}
          onClick={() => emitRichTextCommand('subscript')}
        >
          A₂
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.code}
          onClick={() => emitRichTextCommand('code')}
        >
          <ActionIcon icon={<CodeOutlined />} tooltip="行内代码" />
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={richTextAttrs.blockquote}
          onClick={() => emitRichTextCommand('blockquote')}
        >
          <ActionIcon icon={<EditOutlined />} tooltip="引用" />
        </CheckboxButton>
      </ButtonGroup>

      <ButtonGroup className="row" passive>
        <CheckboxButton
          style={{ flex: 1 }}
          onClick={() => emitRichTextCommand('clear')}
        >
          <ActionIcon icon={<CloseOutlined />} tooltip="清除格式" />
        </CheckboxButton>

        <CheckboxButton
          style={{ flex: 1 }}
          checked={!!textFormatPainter}
          onClick={() => toggleTextFormatPainter()}
          onDoubleClick={() => toggleTextFormatPainter(true)}
        >
          <ActionIcon icon={<FormatPainterOutlined />} tooltip="格式刷（双击使用）" />
        </CheckboxButton>
        <div>
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <div className="link-popover">
                <Input value={link} onChange={(e) => setLink(e as string)} placeholder="请输入超链接" />
                <div className="btns">
                  <Button size="small" disabled={!richTextAttrs.link} onClick={removeLink} style={{ marginBottom: '5px' }}>移除</Button>
                  <Button size="small" type="primary" onClick={() => updateLink(link)}>确认</Button>
                </div>
              </div>
            }
          >
            <div
              className="action-btn"
            >
              <ActionIcon icon={<LinkOutlined />} tooltip="超链接" />
            </div>
          </Popover>
        </div>

      </ButtonGroup>
      <Divider />

      <ButtonGroup
        className="row"
      >
        <Button onClick={() => { emitRichTextCommand('align', 'left') }} style={{ flex: 1 }}><ActionIcon icon={<AlignLeftOutlined />} tooltip="左对齐" /></Button>
        <Button onClick={() => { emitRichTextCommand('align', 'center') }} style={{ flex: 1 }}><ActionIcon icon={<AlignCenterOutlined />} tooltip="居中" /></Button>
        <Button onClick={() => { emitRichTextCommand('align', 'right') }} style={{ flex: 1 }}><ActionIcon icon={<AlignRightOutlined />} tooltip="右对齐" /></Button>
        <Button onClick={() => { emitRichTextCommand('align', 'justify') }} style={{ flex: 1 }}><ActionIcon icon={<ColumnWidthOutlined />} tooltip="两端对齐" /></Button>
      </ButtonGroup>


      <div className="row">
        <ButtonGroup style={{ flex: 1 }}>
          <Button first style={{ flex: 1 }} onClick={() => emitRichTextCommand('bulletList')}><ActionIcon icon={<UnorderedListOutlined />} tooltip="项目符号" /></Button>
          <Popover
            placement="bottom"
            trigger="click"
            content={
              <div className="list-wrap">
                {bulletListStyleTypeOption.map((item) => (<ul className="list"
                  key={item}
                  style={{ listStyleType: item }}
                  onClick={() => emitRichTextCommand('bulletList', item)}
                >
                  {new Array(3).fill('').map((key, index) => (<li className="list-item" key={index}><span></span></li>))}
                </ul>))}
              </div>
            }>
            <div
              className="action-btn"
            >
              <ActionIcon icon={<DownOutlined />} />
            </div>
          </Popover>
        </ButtonGroup>
        <div style={{ width: '10px' }}></div>
        <ButtonGroup style={{ flex: 1 }} passive>
          <Button first style={{ flex: 1 }} type={richTextAttrs.orderedList ? 'primary' : 'default'} onClick={() => emitRichTextCommand('orderedList')}><ActionIcon icon={<OrderedListOutlined />} tooltip="编号" /></Button>
          <Popover
            trigger="click"
            placement="bottom"
            content={
              <div className="list-wrap">
                {orderedListStyleTypeOption.map(item => (<ul className="list"
                  key={item}
                  style={{ listStyleType: item }}
                  onClick={() => emitRichTextCommand('orderedList', item)}
                >
                  {new Array(3).fill('').map((key, index) => (<li className="list-item" key={index}><span></span></li>))}
                </ul>))}
              </div>}>
            <div
              className="action-btn"
            >
              <ActionIcon icon={<DownOutlined />} />
            </div>
          </Popover>
        </ButtonGroup>
      </div>

    </div >
  );
};

export default RichTextBase;
