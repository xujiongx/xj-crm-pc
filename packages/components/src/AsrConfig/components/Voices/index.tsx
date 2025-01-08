import { FC, Fragment, useState } from 'react';
import { Modal, Form, Typography } from 'antd';
import Slider from './slider';

const { Link } = Typography;

interface VoiceConfigProps {
  options: { label: string; key: string; props: Record<string, any> }[];
  value?: Record<string, number>;
  readonly?: boolean;
  onChange?: (data: VoiceConfigProps['value']) => void;
}

const VoiceConfig: FC<VoiceConfigProps> = ({
  options,
  readonly,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = await form.validateFields();
    onChange?.(values);
    setOpen(false);
  };

  return (
    <Fragment>
      <Modal
        title="音色配置"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onOk}
      >
        <Form form={form}>
          {options?.map(({ label, key, props }) => (
            <Form.Item key={key} label={label} name={key}>
              <Slider {...props} disabled={readonly} />
            </Form.Item>
          ))}
        </Form>
      </Modal>
      <Link
        disabled={readonly}
        onClick={() => {
          setOpen(true);
          form.setFieldsValue(value);
        }}
      >
        设置
      </Link>
    </Fragment>
  );
};

export default VoiceConfig;
