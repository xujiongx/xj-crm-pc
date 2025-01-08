import { ReactEditor } from 'slate-react';
import DigitalPopover from '../DigitalPopover';
import { Transforms, Editor, Element } from 'slate';
import './index.less';
import { useMemo } from 'react';

export type ActionElement = {
  type: 'insert-action';
  readonly: boolean;
  property: { type: string };
  children: { type?: string; text: string }[];
};

const ActionText = ({
  attributes,
  editor,
  element,
  children,
  readOnly,
  actionList,
}) => {
  const currentAction = useMemo(
    () => actionList?.find((item) => item.code === element?.property?.type),
    [actionList, element?.property?.type],
  );

  const onChangeAction = (value: string) => {
    const path = ReactEditor.findPath(editor, element);
    if (value) {
      Transforms.setNodes<ActionElement>(
        editor,
        {
          property: { ...element.property, type: value },
        },
        { at: path },
      );
      return;
    }
    Transforms.removeNodes(editor, {
      at: path,
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === 'insert-action',
    });
  };

  if (!currentAction) {
    return <p {...attributes}>{children}</p>;
  }
  return (
    <DigitalPopover
      actionList={actionList}
      onChange={onChangeAction}
      isUpdate
      value={element?.property?.type}
      disabled={readOnly}
    >
      <span
        className="action-text-wrapper"
        {...attributes}
        contentEditable={false}
      >
        {!readOnly && children}动作｜{currentAction?.name}
      </span>
    </DigitalPopover>
  );
};

export default ActionText;
