import { FC, ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Editor, Range } from 'slate';
import { useFocused, useSlate } from 'slate-react';
import { serialize, voiceRegText } from '../../utils';

const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
interface AuditionProps {
  children?: ReactNode;
  onSelectedText?: (val?: string) => void;
}

const Audition: FC<AuditionProps> = ({ children, onSelectedText }) => {
  const editor = useSlate();
  const ref = useRef<any>();
  const inFocus = useFocused();
  const { selection } = editor;

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (
      !selection ||
      !inFocus ||
      Range!.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style');
      el.style.display = 'none';
      return;
    }

    const text = Editor.string(editor, selection);
    /** 不存在数字、中文、字母 或 全空格*/
    const isExistPureSep =
      !new RegExp(voiceRegText).test(text!) ||
      new RegExp(/^[ ]+$/g).test(text!);
    if (isExistPureSep) return;

    const fragment = Editor.fragment(editor, selection);
    const fragmentText = serialize(fragment);
    onSelectedText?.(fragmentText);

    const domSelection = window.getSelection()!;
    const domRange = domSelection!.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    const { top, left, height } = rect;

    el.style.display = 'block';
    el.style.position = 'absolute';
    el.style.top = `${top + window.scrollY + height + 6}px`;
    el.style.left = `${left}px`;
  });

  return (
    <Portal>
      <div
        ref={ref}
        onMouseDown={(ev) => {
          ev.preventDefault();
        }}
      >
        {children}
      </div>
    </Portal>
  );
};

export default Audition;
