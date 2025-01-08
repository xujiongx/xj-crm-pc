import { uid } from '@aicc/shared';
import { useControllableValue } from 'ahooks';
import { useMemo, useState } from 'react';
import Uploader, { UploaderFile, UploaderProps } from './';

interface UploaderFormProps
  extends Omit<
    UploaderProps,
    'onChange' | 'maxCount' | 'renderContent' | 'fileList'
  > {
  value?: string;
  onChange?: (value: string) => void;
  renderContent?: (value: string, loading: boolean) => React.ReactNode;
}

const UploaderForm = ({ ...rest }: UploaderFormProps) => {
  const [value, setValue] = useControllableValue(rest);
  const [file, setFile] = useState<UploaderFile>();

  const fileList = useMemo(
    () =>
      value
        ? value === file?.url
          ? [file!]
          : [{ url: value, name: value, uid: uid() }]
        : [],
    [value],
  );

  return (
    <Uploader
      {...rest}
      fileList={fileList}
      maxCount={1}
      renderContent={(fileList, loading) =>
        rest.renderContent?.(fileList[0]?.url || '', loading)
      }
      onChange={({ file }) => {
        if (file.status === 'done') {
          setFile(file);
          setValue(file.url);
        } else if (file.status === 'error' || file.status === 'removed') {
          setValue(undefined);
        }
      }}
    />
  );
};

export default UploaderForm;
