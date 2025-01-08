import { Input } from 'antd';
import {
  ForwardRefRenderFunction as FC,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

interface TextAreaProps {
  onPressEnter: (text: string) => void;
}

export interface TextAreaRef {
  text: string;
  onClear: () => void;
}

const TextArea: FC<TextAreaRef, TextAreaProps> = ({ onPressEnter }, ref) => {
  const [text, setText] = useState('');

  useImperativeHandle(ref, () => ({
    text,
    onClear: () => setText(''),
  }));

  return (
    <Input.TextArea
      value={text}
      placeholder="输入发送内容，回车键发送"
      autoSize={{ minRows: 4, maxRows: 4 }}
      onChange={({ target }) =>
        setText(target?.value.trim() ? target?.value : '')
      }
      onPressEnter={(event) => {
        event.preventDefault();
        if (!event.nativeEvent?.isComposing) onPressEnter(text);
      }}
    />
  );
};

export default forwardRef(TextArea);
