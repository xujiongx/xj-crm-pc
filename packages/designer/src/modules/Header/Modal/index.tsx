import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

interface DesignerMoblieModalProps {
  value?: any;
  children: React.ReactNode;
  onSuccess?: (value: any) => void;
}

const DesignerMoblieModal = ({
  value,
  children,
  onSuccess,
}: DesignerMoblieModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && value) {
      form.setFieldsValue({
        title: value?.title,
      });
    }
  }, [open]);

  const afterClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onOk = async () => {
    onSuccess?.(form.getFieldsValue());
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={'编辑标题'}
        afterClose={afterClose}
        onOk={onOk}
        onCancel={() => setOpen(false)}
      >
        <Form form={form}>
          <Form.Item
            label="页面名称"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入页面名称" maxLength={32} showCount />
          </Form.Item>
        </Form>
      </Modal>
      <span onClick={() => setOpen(true)}>{children}</span>
    </>
  );
};

export default DesignerMoblieModal;
