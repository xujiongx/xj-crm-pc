import aiccConfig from '@aicc/config';
import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import type { CrmApiResultType, DataDictionaryItemType } from '@aicc/types';
import { useRequest, useSetState } from 'ahooks';
import { message } from 'antd';
import React from 'react';

interface VoiceConfig {
  service?: string;
  voice?: string;
  speechRate?: number;
  volume?: number;
  pitchRate?: number;
}

export interface TTSConfig extends VoiceConfig {
  modelId?: string;
  ttsType?: number;
  options?: { label: string; key: string; props?: any }[];
}

export interface TTSConfigParams {
  channel?: string;
  defaultPitchRate?: number;
  defaultSpeechRate?: number;
  defaultVolume?: number;
  id?: string;
  language?: string;
  maxPitchRate?: number;
  maxSpeechRate?: number;
  maxVolume?: number;
  minPitchRate?: number;
  minSpeechRate?: number;
  minVolume?: number;
  supplier?: string;
  voice?: string;
  fsTtsMapId?: string;
  voiceName?: string;
}

export const formatTTSData = (values: TTSConfigParams) => {
  const {
    defaultPitchRate,
    defaultSpeechRate,
    defaultVolume,
    maxPitchRate,
    maxSpeechRate,
    maxVolume,
    minPitchRate,
    minSpeechRate,
    minVolume,
    ...rest
  } = values;
  const createOption = (
    label: string,
    key: string,
    minVal?: number,
    maxVal?: number,
  ) => ({
    label,
    key,
    props: {
      min: minVal,
      max: maxVal,
    },
  });

  const tryCreateOption = (
    label: string,
    key: string,
    defaultValue: number | undefined,
    minVal: number | undefined,
    maxVal: number | undefined,
  ) => {
    if (
      typeof defaultValue === 'number' &&
      typeof minVal === 'number' &&
      typeof maxVal === 'number'
    ) {
      return createOption(label, key, minVal, maxVal);
    }
    return null;
  };

  const options = [
    tryCreateOption('音量', 'volume', defaultVolume, minVolume, maxVolume),
    tryCreateOption(
      '语速',
      'speechRate',
      defaultSpeechRate,
      minSpeechRate,
      maxSpeechRate,
    ),
    tryCreateOption(
      '语调',
      'pitchRate',
      defaultPitchRate,
      minPitchRate,
      maxPitchRate,
    ),
  ].filter((option) => option !== null);

  return {
    volume: defaultVolume,
    speechRate: defaultSpeechRate,
    pitchRate: defaultPitchRate,
    options,
    ...rest,
  };
};

export const formatTTSDictionary = (data?: string) => {
  try {
    return JSON.parse(data || '[]')?.map(
      ({ id, voiceName, language, ...rest }) => {
        return {
          value: id,
          label: voiceName!,
          language,
          config: formatTTSData({ voiceName, language, ...rest }),
        };
      },
    );
  } catch (error) {
    console.log(error, 'tts音色格式错误');
  }
};

export const formatTTSDictionaryPro = (
  data?: Array<DataDictionaryItemType & { modelId?: string }>,
) => {
  try {
    return data
      ?.filter(({ status }) => status)
      ?.map(({ id, itemText, itemValue, modelId }) => {
        const config = JSON.parse(itemValue || '{}') as TTSConfig;
        return {
          value: id || modelId!,
          label: itemText!,
          config: { ...config, modelId },
        };
      });
  } catch (error) {
    console.log(error, 'tts音色格式错误');
  }
};

const useTTSAudio = (data?: {
  options: { ready: boolean; staleTime?: number };
  voiceType?: 'customVoices' | 'voicesTTS';
  applyProduct?: string;
}) => {
  const { options, voiceType = 'voicesTTS', applyProduct } = data || {};
  const { request } = React.useContext<ConfigProviderProps>(ConfigContext);

  const [state, setState] = useSetState<{
    loading: boolean;
    records: Record<'src' | 'title', string>[];
  }>({
    loading: false,
    records: [],
  });

  /** 查询音色列表 */
  const { data: voicesPro } = useRequest(
    async () => {
      const res = await request<
        CrmApiResultType<Array<DataDictionaryItemType>>
      >('/cloneVoice/getVoiceList', {
        params: { dictCode: 'SSB_TTS' },
      });
      if (res?.code !== 0) return [];
      return formatTTSDictionaryPro(res.result);
    },
    {
      ready: (options?.ready && voiceType === 'voicesTTS') || false,
      staleTime: options?.staleTime || 3000,
      cacheKey: 'SSB_TTS_CLONE',
    },
  );

  /** 查询音色列表 */
  const { data: voices, loading: voicesLoading } = useRequest(
    async () => {
      const res = await request<CrmApiResultType<string>>(
        '/asrTts/getConfig2',
        {
          data: { type: 2, applyProduct },
          method: 'POST',
        },
      );
      if (res?.code !== 0) return [];
      return formatTTSDictionary(res.result);
    },
    {
      ready: (options?.ready && voiceType === 'customVoices') || false,
      staleTime: options?.staleTime || 3000,
      cacheKey: 'SSB_TTS',
    },
  );

  /** 生成录音 */
  const onGenerate = async (
    value: string,
    configId?: string & TTSConfig,
    config?: TTSConfig,
  ) => {
    let ttsParams: TTSConfig & {
      text?: string;
      type?: number;
      ttsConfigId?: string;
    } = {};
    if (voiceType === 'voicesTTS') {
      const { options, service, modelId, ttsType, ...rest } =
        configId as TTSConfig;
      ttsParams = {
        text: value,
        type: service === 'aliyun' ? 1 : 2,
        service,
        ...rest,
      };
    } else if (config) {
      ttsParams = {
        text: value,
        ttsConfigId: configId,
        pitchRate: config?.pitchRate,
        speechRate: config?.speechRate,
        volume: config?.volume,
      };
    } else {
      ttsParams = {
        text: value,
        ttsConfigId: configId,
      };
    }

    const url =
      voiceType === 'customVoices'
        ? '/tts/OfflineTtsController/ttsByConfigIdToHttpServletResponse'
        : '/vts/speech/synthesizer/transition';
    const data = await request<Blob>(url, {
      prefix: `${aiccConfig.crmPrefix}`,
      data: ttsParams,
      method: 'POST',
      responseType: 'blob',
    });
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (data.type === 'application/json') {
        const res = JSON.parse(fileReader.result as string);
        message.error(res.msg || '录音合成失败');
      } else {
        if (data?.size === 0) return;
        const blob = new Blob([data], { type: data?.type || 'audio/wav' });
        const src = URL.createObjectURL(blob);
        const regex = /<\/?(say-as|phoneme)[^>]*>/gi;
        setState(({ records }) => ({
          records: [...records, { src, title: value.replace(regex, '') }],
        }));
      }
    };
    fileReader.readAsText(data);
  };

  /**
   * 合成录音
   * @param config tts音色配置
   */
  const handleSynthetic = async (
    text: string,
    ttsConfigId?: string & TTSConfig,
    config?: TTSConfig,
  ) => {
    if (!ttsConfigId) return;
    setState({ loading: true, records: [] });
    const messages = text?.split('||') || [];
    for (const str of messages) {
      try {
        voiceType === 'voicesTTS'
          ? await onGenerate(str, ttsConfigId)
          : await onGenerate(str, ttsConfigId, config);
      } catch (err) {
        console.log(err, 'err');
        break;
      }
    }
    setState({ loading: false });
  };

  return {
    voicesLoading,
    voices: voiceType === 'voicesTTS' ? voicesPro : voices,
    loading: state.loading,
    records: state?.records,
    handleSynthetic,
  };
};

export default useTTSAudio;
