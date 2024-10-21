// import config from '@aicc/config';
// import { getToken, stringifySignature } from '@aicc/shared';
import { CloseOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Upload, message } from 'antd';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import React from 'react';
import { ImageAcceptType, beforUpload } from '.';
import DIcon from '../../Element/DIcon';
import styles from './index.less';

interface ImageUploaderProps {
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const ImageUploader = ({
  disabled: customDisabled,
  ...rest
}: ImageUploaderProps) => {
  const [value, setValue] = useControllableValue(rest);
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  return (
    <Upload
      showUploadList={false}
      // headers={{ 'X-Access-Token': getToken()! }}
      className={styles.card}
      maxCount={1}
      accept={ImageAcceptType.map((accept) => `.${accept}`).join(',')}
      // action={`${config?.crmPrefix}/scp/exam/file/common/upload?${stringifySignature(
      //   {},
      //   getToken()!,
      // )}`}
      disabled={mergedDisabled}
      beforeUpload={(file) => beforUpload(file, 'image')}
      onChange={({ file }) => {
        if (file.status === 'done') {
          if (file.response?.code === 0 && file.response.result) {
            setValue?.(file.response.result);
          } else {
            message.error('图片上传失败');
          }
        } else if (file.status === 'error') {
          message.error('图片上传失败');
        }
      }}
    >
      <div className={styles.image}>
        {value ? (
          <>
            <img src={value} alt="图片" />
            {!mergedDisabled && (
              <div className={styles.mask}>
                <DIcon type="icon-upload" />
              </div>
            )}

            {!mergedDisabled && (
              <div
                className={styles.close}
                onClick={(e) => {
                  e.stopPropagation();
                  setValue('');
                }}
              >
                <CloseOutlined />
              </div>
            )}
          </>
        ) : (
          <DIcon type="icon-upload" />
        )}
      </div>
    </Upload>
  );
};

export default ImageUploader;
