import ImageFiled from '@/pages/MotionVideo/components/ImageFiled';
import { useSaveOrUpdateVideo } from '@/pages/MotionVideo/hooks/useVideoServices';
import { uid } from '@aicc/shared';
import { Form, Input, message, Modal } from 'antd';
import { useEffect } from 'react';
import RadioSelectFiled from '../RatioSelectFiled';

const CreateEmptyModal = (props: any) => {
  const { visible, setVisible, refresh } = props;
  const [form] = Form.useForm();

  const { saveVideoAsync, saveVideoLoading } = useSaveOrUpdateVideo();

  const handleOk = async () => {
    const values = await form.validateFields();

    const res = await saveVideoAsync({
      ...values,
      jsonData: `{"pages":[{"id":"${uid()}","elements":[],"background":{"type":"solid","color":"#fff"}}],"hiddenElementIdList":[]}`,
    });
    if (res.code) return;
    message.success(res?.msg);
    setVisible(false);
    refresh();
  };
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  return (
    <Modal
      title="新建视频"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading: saveVideoLoading,
      }}
      width={700}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
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
          label="选择尺寸比例:"
          name="dimensionRatio"
          rules={[{ required: true, message: '视频名称不能为空' }]}
          initialValue={1}
        >
          <RadioSelectFiled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEmptyModal;
