import ImageFiled from '@/pages/MotionVideo/components/ImageFiled';
import {
  useRecordVideo,
  useSaveCurVideo,
} from '@/pages/MotionVideo/components/PPTEditor/hooks';
import {
  useMainStore,
  useSlidesStore,
} from '@/pages/MotionVideo/components/PPTEditor/store';
import { getUrlParams } from '@/utils';
import { Form, message, Modal, Radio } from 'antd';
import { InputNumberRange } from 'qnzs-ui';
import { useEffect } from 'react';
import { history } from 'umi';

export const EXPORT_SCOPE_OPTIONS = [
  { label: '全部', value: 1 },
  { label: '当前页', value: 2 },
  { label: '自定义', value: 3 },
];
export const EXPORT_FORMAT_OPTIONS = [{ label: 'MP4', value: 'mp4' }];

const computedTime = (slides: any[]) => {
  return slides
    .map((slide) => {
      const timeArr =
        slide.animations?.map((item: { end: number }) => item.end) || [];
      return Math.max(...(timeArr.length ? timeArr : [0]));
    }, 0)
    .reduce((a: number, b: number) => a + b, 0);
};

const ExportVideoModal = (props) => {
  const { id } = getUrlParams<{
    id: string;
    dimensionRatio: string;
    name: string;
  }>();
  const { visible, setVisible, isWithSave = false } = props;

  const slides = useSlidesStore((state) => state.slides);
  const slideIndex = useSlidesStore((state) => state.slideIndex);

  const [form] = Form.useForm();

  const { recordingVideoAsync, recordingVideoLoading } = useRecordVideo();

  const { localPPTData } = useSaveCurVideo();

  const onOk = async () => {
    const values = await form.validateFields();

    // 处理播放起始页面
    const pager = {
      toVideoStartPage: 1,
      toVideoEndPage: slides.length,
    };
    if (values.outScope === 1) {
      pager.toVideoStartPage = 1;
    } else if (values.outScope === 2) {
      pager.toVideoStartPage = slideIndex + 1;
    } else if (values.outScope === 3) {
      pager.toVideoStartPage = values.customerScope.min;
      pager.toVideoEndPage = values.customerScope.max;
    }

    const data = {
      id,
      coverUrl: values.coverUrl,
      outScope: values.outScope,
      ...pager,
      outFormat: values.outFormat,
      coverType: values.coverUrl ? '2' : '1',
      duration: Math.ceil(computedTime(slides)),
      jsonData: isWithSave ? JSON.stringify(localPPTData) : undefined,
    };

    const res = await recordingVideoAsync(data);
    if (res?.code) return;
    message.success(res?.msg);
    history.push('/motion-video/list');
  };

  const isHasCustomerScope = !!(Form.useWatch('outScope', form) === 3);
  const videoData = useMainStore((state) => state.videoData);

  useEffect(() => {
    if (!videoData) return;
    const { coverUrl, outScope, toVideoStartPage, toVideoEndPage, outFormat } =
      videoData;
    const initFormData = {
      coverUrl,
      outScope: outScope || 1,
      customerScope: {
        min: toVideoStartPage,
        max: toVideoEndPage,
      },
      outFormat: outFormat || 'mp4',
    };
    form.setFieldsValue(initFormData);
  }, [videoData]);

  return (
    <Modal
      open={visible}
      title="导出视频"
      onCancel={() => setVisible(false)}
      width={700}
      onOk={onOk}
      okButtonProps={{
        loading: recordingVideoLoading,
      }}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
        <Form.Item label="上传封面:" name="coverUrl">
          <ImageFiled
            action="/srb/mg/files/upload/nosave"
            onDelete={() => {
              form.setFieldValue('coverUrl', undefined);
            }}
          />
        </Form.Item>
        <Form.Item
          name="outScope"
          label="导出范围:"
          rules={[{ required: true, message: '导出范围不能为空' }]}
          initialValue={1}
        >
          <Radio.Group options={EXPORT_SCOPE_OPTIONS}></Radio.Group>
        </Form.Item>
        {isHasCustomerScope && (
          <Form.Item
            name="customerScope"
            label="自定义范围:"
            rules={[{ required: true, message: '自定义范围' }]}
          >
            <InputNumberRange min={0} max={slides.length} />
          </Form.Item>
        )}
        <Form.Item
          name="outFormat"
          label="导出格式:"
          rules={[{ required: true, message: '导出格式不能为空' }]}
          initialValue={'mp4'}
        >
          <Radio.Group options={EXPORT_FORMAT_OPTIONS}></Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExportVideoModal;
