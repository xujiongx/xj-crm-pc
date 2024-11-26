import React, { useRef } from 'react';
import './index.less';

interface FileInputProps {
  accept?: string;
  onChange: (files: FileList) => void;
  children: React.ReactNode;
}

const FileInput: React.FC<FileInputProps> = ({ accept = 'image/*', onChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    inputRef.current.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) onChange(files);
  };

  return (
    <div className="file-input" onClick={handleClick}>
      {children}
      <input
        className="input"
        type="file"
        name="upload"
        ref={inputRef}
        accept={accept}
        onChange={handleChange}
      />
    </div>
  );
};

export default FileInput;
