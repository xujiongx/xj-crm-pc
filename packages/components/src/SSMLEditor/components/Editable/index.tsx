import { ActionType, prefix } from '../../index';
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react';
import ActionText, { ActionElement } from '../ActionText';
import PauseText, { PauseElement } from '../PauseText';
import PhonemeComponent, { PhonemeElement } from '../Phoneme';
import SayAsComponent, { SayAsElement } from '../SayAs';
import { createEditor, Descendant } from 'slate';
import { parseSSML } from '../../utils';
import './index.less'
import { withHistory } from 'slate-history';

type SsmlEditableProps = {
  value: string;
  actionList?: ActionType[];
};

const SsmlEditable = ({
  value,
  actionList,
}: SsmlEditableProps) => {
  const editor = withHistory(withReact(createEditor()))
  const initialValue = [{ type: 'text', children: [...parseSSML(value)] }] as Descendant[]
  const renderElement = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element?.type) {
      case 'phoneme':
        return (
          <PhonemeComponent
            {...props}
            editor={editor}
            readOnly
            element={element as PhonemeElement}
          />
        );
      case 'say-as':
        return (
          <SayAsComponent
            {...props}
            editor={editor}
            readOnly
            element={element as SayAsElement}
          />
        );
      case 'break':
        return (
          <PauseText
            {...props}
            editor={editor}
            readOnly
            element={element as PauseElement}
          />
        );
      case 'insert-action':
        return (
          <ActionText
            {...props}
            actionList={actionList}
            editor={editor}
            readOnly
            element={element as ActionElement}
          />
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  };
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <div className={`${prefix}-panel`}>
        <Editable
          readOnly
          renderElement={renderElement}
        />
      </div>
    </Slate>
  );
};

export default SsmlEditable