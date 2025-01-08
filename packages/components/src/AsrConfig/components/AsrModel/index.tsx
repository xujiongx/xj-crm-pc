import { useASRDataType, useTTSAudio } from '@aicc/hooks';
import { VOICE_LANGUAGE_TYPE } from '@aicc/shared';
import {
  Button,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from 'antd';
import { mapValues, omitBy, uniqBy } from 'lodash';
import { FC, useEffect, useMemo } from 'react';
import { RecorderAudio } from '../../../Recorder';
import { prefix as cssPrefix } from '../../index';
import VoiceConfig from '../Voices';
import './index.less';

const { Link, Text } = Typography;

interface VoiceItem {
  value: string;
  label: string;
  config: {
    modelId: string | undefined;
    ttsType?: number | undefined;
    options?: {
      label: string;
      key: string;
      props?: any;
    }[];
    service: string;
    voice: string;
    speechRate: number;
    volume: number;
    pitchRate: number;
  };
  language?: string;
}

interface AsrModelConfigProps {
  showBroadcastType?: boolean;
  form: FormInstance;
  readonly?: boolean;
  onOk: (data: Record<string, any>) => void;
  applyProduct?:string
}

const AsrModelConfig: FC<AsrModelConfigProps> = ({
  showBroadcastType = true,
  form,
  readonly,
  onOk,
  applyProduct,
}) => {
  const {
    voices: voicesClone,
    loading,
    records,
    handleSynthetic,
  } = useTTSAudio({ options: { ready: true }, voiceType: 'customVoices',applyProduct });

  const prefix = `${cssPrefix}-model`;
  const voices = voicesClone || ([] as VoiceItem[]);

  /**ASR */
  const { data: asrModels = [] } = useASRDataType(
    { staleTime: 3000, ready: true},
    (data: any[]) =>
      data?.map(({ id, languageType, fsAsrMapId }) => {
        return {
          value: id,
          label: languageType,
          config: {
            KeyWordsMatchedToUse: [languageType],
            AsrServiceID: fsAsrMapId,
            AsrModelName: languageType,
            AsrModelID: fsAsrMapId,
            asrId: fsAsrMapId,
          },
        };
      }),
      applyProduct,
  );

  const validatorAsr = (field: string) =>
    new Promise<string | void>((resolve, reject) => {
      const config = form.getFieldValue('asrConfig');
      if (config?.length !== uniqBy(config, field)?.length)
        reject('机器人识别模型不能重复');
      resolve();
    });

  /**录音合成 */
  const onGenerate = async () => {
    const { text, voice, asrConfig } = form.getFieldsValue();
    if (!text?.trim())
      return message.open({
        type: 'warning',
        content: '缺少测试文本！',
      });
    if (asrConfig) {
      const item = asrConfig?.find(({ ttsId }) => ttsId === voice);
      const asr = voices?.find(({ value }) => value === voice);
      if (!asr?.config)
        return message.open({
          type: 'warning',
          content: '音色不存在',
        });
      const { SpeechRate, Volume, PitchRate } = item?.voiceConfig || {};
      const { options: _options, ...rest } = asr?.config || {};
      handleSynthetic(text, voice, {
        ...rest,
        ...(item?.voiceConfig
          ? {
              speechRate: Number(SpeechRate || 0),
              volume: Number(Volume || 0),
              pitchRate: Number(PitchRate || 0),
            }
          : {}),
      });
    } else {
      handleSynthetic(text, voice);
    }
  };
  const voicesMap = useMemo(
    () =>
      voices?.reduce(
        (result: { [key: string]: any }, current: { [key: string]: any }) => {
          if (!current?.value || !current?.config) return result;
          const {
            voice,
            volume,
            speechRate,
            pitchRate,
            options,
            modelId,
            fsTtsMapId,
          } = current?.config;
          result[current.value] = {
            modelId,
            TtsServiceID: fsTtsMapId,
            fsTtsMapId,
            Voice: voice,
            Volume: `${volume || 0}`,
            SpeechRate: `${speechRate || 0}`,
            PitchRate: `${pitchRate || 0}`,
            ttsId: current.value,
            options,
          };
          return result;
        },
        {},
      ),
    [voices],
  );

  const onFinish = async () => {
    const { asrConfig, ...rest } = await form.validateFields();
    const asrMap = asrModels.reduce<
      Record<string, (typeof asrModels)[0]['config']>
    >(
      (
        result: { [x: string]: any },
        current: { value: string | number; config: any },
      ) => {
        if (current?.value) result[current.value] = current?.config;
        return result;
      },
      {},
    );

    const configs = asrConfig.map(({ asrId, ttsId, voiceConfig }, index) => {
      const { options: _options, fsTtsMapId, ...rest } = voicesMap[ttsId];
      return {
        ...asrMap[asrId],
        ...rest,
        ...mapValues(omitBy(voiceConfig, (value) => !value) || {}, (value) =>
          typeof value === 'number'
            ? `${value}`
            : value === 'undefined'
              ? '0'
              : value,
        ),
        ttsId: fsTtsMapId,
        IsDefault: index === 0,
        asrConfigId: asrId,
        ttsConfigId: ttsId,
      };
    });
    onOk({
      ...rest,
      conTimbreSetting: JSON.stringify(configs),
    });
  };

  useEffect(() => {
    if (voices?.length) {
      form.setFieldsValue({ voice: voices?.[0]?.value });
    }
  }, [voices]);

  return (
    <Form
      form={form}
      className={`${prefix}-form`}
      initialValues={{ asrConfig: [{}] }}
      colon={false}
      requiredMark={false}
      onFinish={onFinish}
      disabled={readonly}
    >
      <Form.List name="asrConfig">
        {(fields, { add, remove }) =>
          fields?.map((field, index) => (
            <div className={`${prefix}-item`} key={field.key}>
              <Form.Item
                name={[field.name, 'asrId']}
                label="机器人识别模型"
                rules={[
                  { required: true, message: '请选择机器人识别模型' },
                  {
                    validator: () => validatorAsr('asrId'),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={asrModels}
                  onChange={async () => {
                    form.setFieldValue(
                      ['asrConfig', field.name, 'ttsId'],
                      undefined,
                    );
                    // 获取所有 asrId 字段的值
                    const allAsrIds = form
                      .getFieldValue('asrConfig')
                      .map((config) => config.asrId);
                    // 重新校验所有 asrId 字段
                    allAsrIds.forEach(async (asrId: string, index: number) => {
                      if (asrId) {
                        try {
                          await form.validateFields([
                            ['asrConfig', index, 'asrId'],
                          ]);
                        } catch (error) {
                          console.log('🚀 ~ allAsrIds.forEach ~ error:', error);
                        }
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                dependencies={[['asrConfig', field.name, 'asrId']]}
                noStyle
              >
                {({ getFieldValue }) => {
                  const namePath = ['asrConfig', field.name, 'asrId'];
                  const configModel = getFieldValue(namePath);
                  const asrModelName = asrModels.find(
                    (item) => item?.value === configModel,
                  )?.label;
                  const type = VOICE_LANGUAGE_TYPE.find(
                    (item: { label: string }) => item?.label === asrModelName,
                  )?.value;
                  return (
                    <Form.Item
                      name={[field.name, 'ttsId']}
                      label="机器人使用音色"
                      rules={[
                        { required: true, message: '请选择机器人使用音色' },
                        {
                          validator: () => validatorAsr('ttsId'),
                          message: '机器人音色不能重复',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="label"
                        options={voices.filter((item: { language: string }) => {
                          return item?.language === type;
                        })}
                        onChange={(ttsId) => {
                          const namePath = [
                            'asrConfig',
                            field.name,
                            'voiceConfig',
                          ];
                          const { Volume, PitchRate, SpeechRate } =
                            voicesMap[ttsId] || {};
                          form.setFieldValue(namePath, {
                            Volume,
                            PitchRate,
                            SpeechRate,
                          });
                        }}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Space>
                <Form.Item
                  noStyle
                  dependencies={[['asrConfig', field.name, 'ttsId']]}
                >
                  {({ getFieldValue }) => {
                    const ttsId = getFieldValue([
                      'asrConfig',
                      field.name,
                      'ttsId',
                    ]);
                    const { options } = voicesMap[ttsId] || {};
                    return options?.length ? (
                      <Form.Item noStyle name={[field.name, 'voiceConfig']}>
                        <VoiceConfig
                          key={ttsId}
                          readonly={readonly}
                          options={options?.map(
                            (item: Record<string, any>) => ({
                              ...item,
                              key: (item.key as string)?.replace(
                                /\b\w/g,
                                ($1) => $1.toUpperCase(),
                              ),
                            }),
                          )}
                        />
                      </Form.Item>
                    ) : null;
                  }}
                </Form.Item>
                {index ? (
                  <Link
                    disabled={readonly}
                    onClick={() => (readonly ? undefined : remove(index))}
                  >
                    删除
                  </Link>
                ) : null}
                {fields?.length < asrModels?.length &&
                index === fields?.length - 1 ? (
                  <Link disabled={readonly} onClick={() => add()}>
                    添加
                  </Link>
                ) : null}
              </Space>
            </div>
          ))
        }
      </Form.List>
      <div className={`${prefix}-audition`}>
        <Form.Item label="音色测试" name="voice">
          <Select showSearch optionFilterProp="label" options={voices} />
        </Form.Item>
        <Form.Item noStyle name="text">
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 4 }}
            placeholder="输入测试文本"
            maxLength={350}
            showCount
          />
        </Form.Item>
        <Button
          loading={loading}
          onClick={onGenerate}
          style={{ marginTop: 10 }}
        >
          立即合成
        </Button>
        {records?.length ? (
          <ul className={`${prefix}-records`}>
            {records?.map(({ src }, index) => (
              <li key={src}>
                <Text>{`答案${index + 1}`}</Text>
                <RecorderAudio
                  src={src}
                  showSlider
                  speedIcon={null}
                  recordIcon={null}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {showBroadcastType ? (
        <Form.Item
          label="真人录音"
          tooltip="开启真人录音后，机器人绑定的知识对应下的话术会优先使用真人录音，若没有真人录音会在使用合成录音进行兜底"
          valuePropName="checked"
          name="broadcastType"
          normalize={(value) => (value ? 1 : 0)}
        >
          <Switch />
        </Form.Item>
      ) : null}

      <Button htmlType="submit" type="primary">
        保存
      </Button>
    </Form>
  );
};

export default AsrModelConfig;
