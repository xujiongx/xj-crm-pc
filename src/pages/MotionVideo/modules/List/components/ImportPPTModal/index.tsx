import ImageFiled from '@/pages/MotionVideo/components/ImageFiled';
import { request } from '@/services/crm';
import { Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import PPTSelect from '../PPTSelectFiled';

const PPTImportModal: React.FC<any> = (props) => {
  const { visible, setVisible, refresh, data = undefined } = props;

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const { id, name, file, coverUrl } = values;
      const formData = new FormData();
      formData.append('name', name);
      if (id) formData.append('id', id);
      if (coverUrl) formData.append('coverUrl', coverUrl);
      formData.append('file', file);
      request('/srb/mg/ppt/upload', {
        method: 'POST',
        data: formData,
      }).then((res: any) => {
        setLoading(false);
        if (res?.code === 0) {
          message.success(res.msg);
          setVisible(false);
          form.resetFields();
          refresh();
        }
      });
    });
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const { id, name, coverUrl } = data;
    const initFormData = {
      id,
      name,
      coverUrl,
    };
    form.setFieldsValue(initFormData);
  }, [data, visible]);

  return (
    <Modal
      title="PPT转视频"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading,
      }}
      width={700}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item name="id" hidden></Form.Item>
        <Form.Item
          label="视频名称:"
          name="name"
          rules={[{ required: true, message: '视频名称不能为空' }]}
        >
          <Input showCount maxLength={10} placeholder="请输入视频名称" />
        </Form.Item>
        <Form.Item label="上传封面:" name="coverUrl">
          <ImageFiled
            action="/srb/mg/files/upload/nosave"
            onDelete={() => {
              form.setFieldValue('coverUrl', undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          label="上传PPT:"
          name="file"
          rules={[{ required: true, message: '上传PPT不能为空' }]}
        >
          <PPTSelect />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PPTImportModal;
