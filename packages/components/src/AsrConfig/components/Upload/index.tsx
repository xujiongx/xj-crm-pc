import { downloadUrlFile } from '@aicc/shared';
import { InboxOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Form, Modal, Typography, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { FC, Fragment } from 'react';
import { prefix } from '../../index';
import '../../index.less';

export const fileType = {
  regex: /\.(wav|mp3|m4a|aac)$/i,
  tooltip: '.wav, .mp3, .m4a, .aac',
  accept: '.wav,.mp3,.m4a,.aac',
};

interface UploadTapeProps {
  robotId: string;
  readonly?: boolean;
  maxCount?: number;
  limitSize?: number;
  service?: (data: FormData) => Promise<any>;
  refresh?: () => void;
  refreshAllUpload?: () => void;
}

const UploadTape: FC<UploadTapeProps> = ({
  robotId,
  readonly,
  maxCount,
  service,
  refresh,
  limitSize = 5,
  refreshAllUpload,
}) => {
  const [state, setState] = useSetState({ open: false, loading: false });
  const [form] = Form.useForm<{ files: UploadFile[] }>();

  const onClose = () => {
    setState({ open: false });
    form.resetFields();
  };

  const validateTape = (files: UploadFile[]) =>
    new Promise<string | void>((resolve, reject) => {
      for (const { originFileObj } of files) {
        if (!originFileObj) return;
        const { name, size } = originFileObj;
        if (!fileType.regex.test(name))
          return reject(`文件只支持以下格式：${fileType.tooltip}`);

        if (size / 1024 / 1024 > limitSize)
          return reject(`【${name}】文件不能超过${limitSize}M`);
      }
      resolve();
    });

  const onSubmit = async () => {
    try {
      const { files } = await form.validateFields();
      setState({ loading: true });
      const formData = new FormData();
      files?.forEach((file) => {
        formData.append('files', file.originFileObj!);
      });
      Object.entries<any>({ robotId }).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const res = await service?.(formData);
      setState({ loading: false, open: false });
      if (res?.code !== 0) return;
      const { message, isError, url } = res?.result || {};
      onClose();
      refresh?.();
      refreshAllUpload?.();
      Modal[isError ? 'warning' : 'success']({
        title: '提示信息',
        content: (
          <div>
            <p>{message || '导入失败'}</p>
            <p
              style={{ color: 'blue', cursor: 'pointer', margin: 0 }}
              onClick={() => url && downloadUrlFile(url)}
            >
              结果：
              {`${isError ? '导入失败，点击查看明细' : '全部导入成功'}`}
            </p>
          </div>
        ),
      });
    } catch (error) {
      setState({ loading: false });
      console.log(error, 'error');
    }
  };

  return (
    <Fragment>
      <Modal
        title="批量上传录音"
        open={state?.open}
        className={`${prefix}-upload-modal`}
        okButtonProps={{ loading: state?.loading }}
        onCancel={onClose}
        onOk={onSubmit}
      >
        <Form form={form}>
          <Typography.Text strong>导入说明</Typography.Text>
          <ul>
            <li>导入的文件名称需要与录音文件名称保持一致</li>
          </ul>
          <Form.Item
            name="files"
            rules={[
              { required: true, message: '请上传录音文件文件' },
              { validator: (_, value) => validateTape(value) },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(event) =>
              Array?.isArray(event) ? event : event.fileList
            }
          >
            <Upload.Dragger
              multiple={true}
              beforeUpload={() => false}
              maxCount={maxCount}
              accept={fileType?.accept}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽至此处上传</p>
              <p className="ant-upload-hint">
                支持扩展名{fileType.tooltip}音频文件
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
      <Button
        type="primary"
        disabled={readonly}
        onClick={() => setState({ open: true })}
      >
        批量上传录音
      </Button>
    </Fragment>
  );
};

export default UploadTape;
