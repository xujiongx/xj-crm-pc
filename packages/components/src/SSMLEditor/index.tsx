import {
  InfoCircleOutlined,
  MedicineBoxOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Form,
  MenuProps,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { pinyin } from 'pinyin-pro';
import {
  FC,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  BaseElement,
  Descendant,
  Editor,
  Element,
  Node,
  Range,
  Text,
  Transforms,
  createEditor,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react';
import ActionText, { ActionElement } from './components/ActionText';
import Audition from './components/Audition';
import DigitalPopover from './components/DigitalPopover';
import LeafText from './components/LeafText';
import PauseText, { PauseElement } from './components/PauseText';
import PhonemeComponent, { PhonemeElement } from './components/Phoneme';
import SayAsComponent, { SayAsElement } from './components/SayAs';
import { EditorType, interprets } from './constant';
import './index.less';
import SSMLEditorPopover from './popover';
import {
  INSERT_PAUSE,
  getNodeIsContinuous,
  parseSSML,
  serialize,
  validatePy,
  validateSelection,
  withInlines,
  withTextLimit,
} from './utils';

const { Link } = Typography;

export const prefix = 'ssml-editor';

export type CustomElement = SayAsElement | PhonemeElement;

export type ActionType = {
  code: string;
  durAfter?: string;
  durBefore?: string;
  id: string;
  name: string;
  sampleUrl: string;
  virtualmanKey: string;
};

declare module 'slate' {
  export interface BaseElement {
    type: 'phoneme' | 'say-as' | 'text' | 'break' | 'insert-action';
  }
}

export interface SSMLEditorProps {
  placeholder?: string;
  value?: string;
  readOnly?: boolean;
  actionList?: ActionType[];
  isInsertPause?: boolean;
  isDigital?: boolean;
  maxLength?: number;
  title?: string;
  extra?: ReactNode;
  /** 试听 */
  auditionNode?: React.ReactNode;
  onChange?: (value: string) => void;
  onSelectedText?: (val?: string) => void;
}

const SSMLEditor: FC<SSMLEditorProps> = ({
  placeholder = '输入文字将以TTS播放',
  readOnly,
  value = '',
  title,
  isInsertPause,
  actionList,
  isDigital,
  maxLength,
  extra,
  auditionNode,
  onChange,
  onSelectedText,
}) => {
  const editor = useMemo<EditorType>(
    () =>
      withInlines(
        withTextLimit(withHistory(withReact(createEditor())), maxLength),
      ),
    [],
  );

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [digitalDisbale, setDigitalDisbale] = useState(true);
  const [editorValue, setEditorValue] = useState<
    { type: BaseElement['type']; children: Descendant[] }[]
  >([{ type: 'text', children: [...parseSSML(value)] }]);
  const [popover, setPopver] = useState<{
    open: boolean;
    title: string;
    type: string;
  }>();

  /** 读法按钮禁用状态 */
  const [disabledSayAs, setDisabledSayAs] = useState(true);

  useEffect(() => {
    setEditorValue([{ type: 'text', children: [...parseSSML(value)] }]);
  }, [value]);

  const isActive = (tagName: string) => {
    const [node] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n?.type === tagName,
    });
    return !!node;
  };

  const insertPhoneme = async () => {
    const { ph } = await form.validateFields();
    if (!validatePy(ph, popover?.title || '')) return;
    const phoneme: PhonemeElement = {
      type: 'phoneme',
      readonly: true,
      property: { alphabet: 'py', ph },
      children: [],
    };
    Transforms.wrapNodes(editor, phoneme, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
    setPopver(undefined);
  };

  const wrapPhoneme = () => {
    const { selection } = editor;
    if (!selection || isActive('phoneme')) return;

    const regex = /[^\u4e00-\u9fa5]/;
    const text = Editor.string(editor, selection);
    if (regex.test(text))
      return message.open({
        type: 'warning',
        content: '只能对中文进行强注音',
      });
    const isCollapsed = Range.isCollapsed(selection);
    if (isCollapsed) return;
    setPopver({ open: true, title: text, type: 'phoneme' });
    const py = pinyin(text, { toneType: 'num', v: true });
    form.setFieldsValue({ ph: py });
  };

  const wrapSayAs = (attr: string) => {
    const { selection } = editor;
    if (!selection || isActive('say-as')) return;

    const isCollapsed = Range.isCollapsed(selection);
    if (isCollapsed) return;
    const sayAs: SayAsElement = {
      type: 'say-as',
      readonly: true,
      property: { interpretAs: attr },
      children: [],
    };
    Transforms.wrapNodes(editor, sayAs, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const { selection } = editor;
    if (!selection) return;
    const text = Editor.string(editor, selection);
    if (text?.includes('||'))
      return message.open({
        type: 'warning',
        content: '设置读法内容不能包含分隔符“||”',
      });
    setOpen(false);
    switch (key) {
      case 'phoneme':
        wrapPhoneme();
        break;
      default:
        wrapSayAs(key);
        break;
    }
  };

  const renderElement = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element?.type) {
      case 'phoneme':
        return (
          <PhonemeComponent
            {...props}
            editor={editor}
            readOnly={readOnly}
            element={element as PhonemeElement}
          />
        );
      case 'say-as':
        return (
          <SayAsComponent
            {...props}
            editor={editor}
            readOnly={readOnly}
            element={element as SayAsElement}
          />
        );
      case 'break':
        return (
          <PauseText
            {...props}
            editor={editor}
            readOnly={readOnly}
            element={element as PauseElement}
          />
        );
      case 'insert-action':
        return (
          <ActionText
            {...props}
            actionList={actionList}
            editor={editor}
            readOnly={readOnly}
            element={element as ActionElement}
          />
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const handleSelectText = () => {
    const { selection } = editor;
    const isEmpty = selection && Editor.string(editor, selection);
    if (!isEmpty) return message.error('请选择需要设置读法的内容');
    const fragment = Editor.fragment(editor, selection);
    if (!validateSelection(fragment))
      return message.error('只能对纯文本进行设置读法');
    setOpen(true);
  };

  const handlePauseClick = ({ key }) => {
    // 行第一位string
    const { selection } = editor;
    if (!selection) return;
    const [start] = Range.edges(editor?.selection!);
    const { children } = (editor.children?.[start?.path?.[0]] as any) || {};
    const isContinuous = getNodeIsContinuous(children, start, 'break');
    if (isContinuous) {
      message.error('不能连续插入停顿');
      return;
    }

    Transforms.insertNodes(editor, {
      type: 'break',
      readonly: true,
      property: { time: key },
      children: [{ text: '' }],
    } as Node);
  };

  const handleActionClick = (actionId: string) => {
    const { selection } = editor;
    if (!selection) return;
    Transforms.insertNodes(editor, {
      type: 'insert-action',
      readonly: true,
      property: { type: actionId },
      children: [{ text: '' }],
    } as Node);
  };

  const handleChange = (nodes: Descendant[]) => {
    const { selection } = editor;

    if (selection) {
      const range = editor.selection;
      const isCollapsed = Range.isCollapsed(range!);
      if (!isCollapsed) {
        // 聚焦允许插入动作
        setDigitalDisbale(true);
        setDisabledSayAs(false);
      } else {
        /* 未插入光标时，插入停顿置灰不可点击 */
        // 选中内容，禁用插入动作
        setDigitalDisbale(false);
        /** 未选中任何文本时，读法置灰不可点击 */
        setDisabledSayAs(true);
      }
    }

    const text = serialize(nodes);
    if (text === value) return;
    onChange?.(text);
  };

  const checkMaxLength = (str?: string) => {
    if (!maxLength) return;
    const dfs = (nodes: Array<Descendant>) =>
      nodes
        ?.map((node) => {
          if (Text.isText(node)) {
            return Node.string(node);
          }
          if (Node.isNode(node)) {
            if (node?.children?.length) return dfs(node?.children || []);
            return '';
          }
          return '';
        })
        ?.join('');
    const text = dfs(editor?.children || []);
    return text?.length + (str?.length || 0) > maxLength;
  };

  const handleBeforeInput = (event: InputEvent) => {
    if (!maxLength) return;
    // 只能限制数字和字母，对拼音无效
    if (checkMaxLength() && event.inputType !== 'deleteContentBackward') {
      event.preventDefault();
      if (event?.isComposing) {
        editor.children = [{ type: 'text', children: [...parseSSML(value)] }];
        Transforms.collapse(editor, { edge: 'end' });
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        break;
      case 'PageDown':
        event.preventDefault();
        break;
      case 'PageUp':
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  const onHandlePaste = (e) => {
    if (!e.clipboardData) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const sanitizedText = text.replace(/\n|\r/g, '');
    if (checkMaxLength(sanitizedText)) return;

    Editor.insertFragment(editor, [{ text: sanitizedText }]);
    return true;
  };

  return (
    <div className={prefix}>
      <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
        <div className={`${prefix}-toolbar`}>
          {title && <span>{title}</span>}
          <Space size="middle">
            <Dropdown
              trigger={['click']}
              open={open}
              disabled={readOnly}
              menu={{
                items: [
                  { label: '强注音', key: 'phoneme' },
                  {
                    label: '按类型',
                    key: 'say-as',
                    children: interprets?.map(({ value, ...rest }) => ({
                      ...rest,
                      key: value,
                    })),
                  },
                ],
                onClick: handleMenuClick,
              }}
              onOpenChange={(value) => !value && setOpen(value)}
            >
              <SSMLEditorPopover
                {...popover}
                open={popover?.open || false}
                form={form}
                trigger="click"
                placement="right"
                onOpenChange={(value) => !value && setPopver(undefined)}
                footer={
                  popover?.type === 'phoneme' ? (
                    <Link onClick={insertPhoneme}>插入</Link>
                  ) : null
                }
              >
                <Space style={{ width: 'unset' }} size={4}>
                  {/* 用户未选中任何文本时，读法置灰不可点击 */}
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    disabled={readOnly || disabledSayAs}
                    onClick={handleSelectText}
                  >
                    读法
                  </Button>
                  <Tooltip title="选中话术内容后可设置读法">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              </SSMLEditorPopover>
            </Dropdown>
            {isInsertPause && (
              <Tooltip title="光标插入文本，设置播报的停顿时长">
                <Dropdown
                  trigger={['click']}
                  disabled={readOnly || digitalDisbale}
                  menu={{
                    items: INSERT_PAUSE,
                    onClick: handlePauseClick,
                  }}
                >
                  <Button size="middle" icon={<PauseOutlined />}>
                    插入停顿
                  </Button>
                </Dropdown>
              </Tooltip>
            )}
            {isDigital && (
              <DigitalPopover
                disabled={readOnly || digitalDisbale}
                onChange={handleActionClick}
                actionList={actionList || []}
              >
                <Button
                  size="middle"
                  icon={<MedicineBoxOutlined />}
                  disabled={readOnly || digitalDisbale}
                >
                  插入动作
                </Button>
              </DigitalPopover>
            )}
            {extra && extra}
          </Space>
        </div>
        {auditionNode && (
          <Audition onSelectedText={onSelectedText}>{auditionNode}</Audition>
        )}

        <div className={`${prefix}-panel`}>
          <Editable
            placeholder={placeholder}
            readOnly={readOnly}
            renderElement={renderElement}
            renderLeaf={(props) => <LeafText {...props} />}
            onKeyDown={handleKeyDown}
            onPaste={onHandlePaste}
            onDOMBeforeInput={handleBeforeInput}
          />
        </div>
      </Slate>
    </div>
  );
};

export default SSMLEditor;
