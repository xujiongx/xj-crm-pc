import { FC, useEffect, useState, useMemo } from 'react';
import { Form, Space, Typography } from 'antd';
import { Transforms, Editor, Element, Text } from 'slate';
import { RenderElementProps, useSelected, ReactEditor } from 'slate-react';
import InlineChromiumBugfix from '../InlineChromium';
import SSMLPopover from '../../popover';
import { validatePy } from '../../utils';
import { prefix } from '../../index';
import '../../index.less';

const { Link } = Typography;

export type PhonemeElement = {
  type: 'phoneme';
  readonly: boolean;
  property: { alphabet: 'py'; ph: string };
  children: Text[];
};

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: ReactEditor;
  element: PhonemeElement;
  readOnly?: boolean;
  children: React.ReactNode;
}

const PhonemeComponent: FC<Props> = ({
  attributes,
  editor,
  element,
  children,
  readOnly,
}) => {
  const [form] = Form.useForm<{ ph: string }>();
  const [open, setOpen] = useState(false);

  const selected = useSelected();

  const unwrap = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'phoneme',
    });
    setOpen(false);
  };

  /** 修改读法 */
  const onEdit = async () => {
    const { ph } = await form.validateFields();
    if (!validatePy(ph, title)) return;
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes<PhonemeElement>(
      editor,
      {
        property: { ...element.property, ph },
      },
      { at: path },
    );
    setOpen(false);
  };

  useEffect(() => {
    if (!element?.property || !open) return;
    const { ph } = element.property;

    form.setFieldsValue({ ph });
  }, [element, open]);

  const title = useMemo(() => {
    const path = ReactEditor.findPath(editor, element);
    return Editor.string(editor, path);
  }, [element]);

  return (
    <SSMLPopover
      form={form}
      open={open}
      trigger="hover"
      type="phoneme"
      title={title}
      mouseLeaveDelay={0.5}
      onOpenChange={(value) => {
        if (!readOnly) {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes<PhonemeElement>(
            editor,
            { readonly: !value },
            { at: path },
          );
          setOpen(value);
        }
      }}
      footer={
        <Space align="center">
          <Link onClick={unwrap}>取消</Link>
          <Link onClick={onEdit}>修改</Link>
        </Space>
      }
    >
      <span
        {...attributes}
        className={`${prefix}-phoneme`}
        contentEditable={false}
        data-playwright-selected={selected}
      >
        <InlineChromiumBugfix />
        <span>
          {children}
          <span className={`${prefix}-mark`}>注</span>
        </span>
        <InlineChromiumBugfix />
      </span>
    </SSMLPopover>
  );
};

export default PhonemeComponent;
