import { FC, useEffect, useMemo, useState } from 'react';
import { Form, Typography, message } from 'antd';
import { Transforms, Editor, Element, Text } from 'slate';
import { RenderElementProps, ReactEditor } from 'slate-react';
import InlineChromiumBugfix from '../InlineChromium';
import SSMLPopover from '../../popover';
import { interprets } from '../../constant';
import { prefix } from '../../index';

const { Link } = Typography;

export type SayAsElement = {
  type: 'say-as';
  readonly: boolean;
  property: { interpretAs: string };
  children: Text[];
};

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: ReactEditor;
  element: SayAsElement;
  readOnly?: boolean;
  children: React.ReactNode;
}

const SayAsComponent: FC<Props> = ({
  attributes,
  editor,
  children,
  element,
  readOnly,
  ...rest
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const currentInterpret = Form.useWatch('interpretAs', form);

  const renderMark = () => {
    const item = interprets?.find(
      ({ value }) => value === element?.property?.interpretAs,
    );
    if (!item) return '未知';
    const regex = /\((.*?)\)/g;
    return item?.label?.replace(regex, '');
  };

  const unwrap = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'say-as',
    });
    setOpen(false);
  };

  /** 修改读法 */
  const onEdit = async (value: string) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes<SayAsElement>(
      editor,
      {
        property: { ...element.property, interpretAs: value },
      },
      { at: path },
    );
    message.success('修改成功');
    setOpen(false);
  };

  useEffect(() => {
    if (!currentInterpret) return;
    if (currentInterpret !== element.property?.interpretAs) {
      onEdit(currentInterpret);
    }
  }, [currentInterpret]);

  useEffect(() => {
    if (!element?.property) return;
    const { interpretAs } = element.property;

    form.setFieldsValue({ interpretAs });
  }, [element]);

  const title = useMemo(() => {
    const path = ReactEditor.findPath(editor, element);
    return Editor.string(editor, path);
  }, [element]);

  return (
    <SSMLPopover
      form={form}
      open={open}
      type="say-as"
      title={title}
      mouseLeaveDelay={0.5}
      footer={<Link onClick={unwrap}>取消</Link>}
      onOpenChange={(value) => {
        if (!readOnly) {
          const path = ReactEditor.findPath(editor, element);
          Transforms.setNodes<SayAsElement>(
            editor,
            { readonly: !value },
            { at: path },
          );
          setOpen(value);
        }
      }}
    >
      <span
        {...attributes}
        contentEditable={false}
        className={`${prefix}-say-as`}
      >
        <InlineChromiumBugfix />
        <span>
          {children}
          <span className={`${prefix}-mark`}>{renderMark()}</span>
        </span>
        <InlineChromiumBugfix />
      </span>
    </SSMLPopover>
  );
};

export default SayAsComponent;
