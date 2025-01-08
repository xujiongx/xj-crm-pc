import { EditOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
const EditInput = (props: InputProps) => {
  const [isCanEdit, setIsCanEdit] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div>
      {isCanEdit ? (
        <Input
          {...props}
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={(v) => {
            setIsCanEdit(false);
            props.onBlur?.(v);
          }}
        />
      ) : (
        <div className={styles['edit']}>
          <div className={styles['edit-text']}>{props.value}</div>

          <EditOutlined
            className={styles['edit-icon']}
            style={{ marginLeft: '12px' }}
            onClick={() => setIsCanEdit(true)}
          />
        </div>
      )}
    </div>
  );
};

export default EditInput;
