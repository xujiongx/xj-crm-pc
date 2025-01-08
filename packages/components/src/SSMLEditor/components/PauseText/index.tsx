import { ReactEditor, RenderElementProps } from 'slate-react';
import { INSERT_PAUSE } from '../../../SSMLEditor/utils';
import { Dropdown, Tag } from 'antd';
import { FC } from 'react';
import { Editor, Transforms, Element, Node } from 'slate';
import { EditorType } from '../../../SSMLEditor/constant';
import { HistoryEditor } from 'slate-history';

export type PauseElement = {
  type: 'break';
  readonly: boolean;
  property: { time: string };
  children: { type?: string; text: string }[];
};

interface PauseTextProps {
  attributes: RenderElementProps['attributes'];
  editor: EditorType;
  element: PauseElement;
  readOnly?: boolean;
  children: React.ReactNode;
}

const PauseText: FC<PauseTextProps> = ({
  attributes,
  editor,
  element,
  children,
  readOnly,
}) => {
  const onChangePause = ({ key }) => {
    const path = ReactEditor.findPath(editor, element);
    if (key === 'remove') {
      Transforms.removeNodes(editor, {
        at: path,
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === 'break',
      });
      return;
    }
    Transforms.setNodes<PauseElement>(
      editor,
      {
        property: { ...element.property, time: key },
      },
      { at: path },
    );
  };

  return (
    <Dropdown
      trigger={['click']}
      disabled={readOnly}
      menu={{
        items: [
          ...INSERT_PAUSE,
          {
            label: <span style={{ color: '#FF4E4F' }}>移除停顿</span>,
            key: 'remove',
          },
        ],
        selectedKeys: [element?.property?.time],
        onClick: onChangePause,
      }}
    >
      <Tag
        style={{ cursor: 'pointer', margin: '0px 4px' }}
        {...attributes}
        contentEditable={false}
        color="#ed7b2f"
      >
        {children}
        {Number(element?.property?.time) === 0
          ? '连续'
          : `${Number(element?.property?.time) / 1000}s`}
      </Tag>
    </Dropdown>
  );
};

export default PauseText;
