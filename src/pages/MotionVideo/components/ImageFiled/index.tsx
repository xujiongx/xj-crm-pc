import { UploadOutlined } from '@ant-design/icons';
import { DeleteFour } from '@icon-park/react';
import { Button } from 'antd';
import Uploader from '../Uploader';
import styles from './index.less';

const ImageFiled = (props) => {
  const { value, onChange, action, onDelete } = props;

  return (
    <div>
      <div
        className={styles['origin-image']}
        style={{ backgroundImage: `url(${value})` }}
      >
        {value && (
          <div className={styles['delete']} onClick={onDelete}>
            <DeleteFour />
          </div>
        )}
      </div>
      <Uploader
        action={action}
        type="image"
        maxCount={1}
        onUpload={(v) => {
          onChange(v);
        }}
      >
        <Button block icon={<UploadOutlined />}>
          上传图片
        </Button>
        <div
          style={{
            textAlign: 'center',
            marginTop: '4px',
            fontSize: '12px',
            color: '#ccc',
          }}
        >
          支持上传jpg，jpeg，png，大小不超过5M
        </div>
      </Uploader>
    </div>
  );
};

export default ImageFiled;
