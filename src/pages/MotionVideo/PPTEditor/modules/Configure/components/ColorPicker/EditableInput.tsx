import React, { useMemo, useCallback } from 'react';
import styles from './EditableInput.less';
import tinycolor, { ColorFormats } from 'tinycolor2';
import clsx from 'clsx';
interface EditableInputProps {
  value: ColorFormats.RGBA;
  onColorChange: (color: ColorFormats.RGBA) => void;
  className?: string
}

const EditableInput: React.FC<EditableInputProps> = ({ value, onColorChange, className }) => {
  const val = useMemo(() => {
    let _hex = '';
    if (value.a < 1) _hex = tinycolor(value).toHex8String().toUpperCase();
    else _hex = tinycolor(value).toHexString().toUpperCase();
    return _hex.replace('#', '');
  }, [value]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length >= 6) {
      const color = tinycolor(inputValue);
      if (color.isValid()) {
        onColorChange(color.toRgb());
      }
    }
  }, [onColorChange]);

  return (
    <div className={clsx(styles['editable-input'], className) }>
      <input
        className="input-content"
        value={val}
        onChange={handleInput}
      />
    </div>
  );
};

export default EditableInput;
