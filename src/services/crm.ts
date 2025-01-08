import config from '@aicc/config';
import { signatureMiddleware } from '@aicc/shared';
import {
  CrmApiListBaseParamsType,
  CrmApiListResultType,
  CrmApiResultType,
  DataDictionaryItemType,
  ModelTrainType,
} from '@aicc/types';
import { message } from 'antd';
import { QueryClient } from 'react-query';
import { CancelToken, RequestMethod, extend } from 'umi-request';

export let request: RequestMethod = extend({
  prefix: config.crmPrefix,
  errorHandler: (error) => {
    message.error(`接口错误：[${error.response.status}]`);
  },
});

request.use(async (ctx, next) => {
  signatureMiddleware(ctx);
  await next();
});

export const initCrmRequest = (req?: RequestMethod) => {
  if (!req) return;
  request = req;
};

export const queryCrmClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * 模型训练列表
 * @param businessType 业务类型
 * @param businessId 业务类型id
 * @param name 模型名称
 * @returns
 */
export async function query(params: CrmApiListBaseParamsType) {
  return request<
    CrmApiResultType<CrmApiListResultType<ModelTrainType>> | undefined
  >('/modelDrill/drillHistories/newlist', { params });
}

/**
 * 数据字典的选项
 * @param params
 */
export async function apiDataDictionaryItem(params: { dictCode: string }) {
  return request<CrmApiResultType<Array<DataDictionaryItemType>>>(
    '/sys/dict/queryDictItem',
    {
      params,
    },
  );
}

/** 音色合成 */
export const apiTTS = (
  data: {
    voice: string;
    volume: number;
    speechRate: number;
    pitchRate?: number;
    text: string;
    /** 1代表是阿里的音色  2代表是腾讯的音色 3顺丰 */
    type: 1 | 2 | 3;
    /** tts服务厂商 aliyun | tencent */
    service?: string;
  },
  cancelToken?: CancelToken,
) => {
  return request<Blob>('/vts/speech/synthesizer/transition', {
    method: 'POST',
    data,
    responseType: 'blob',
    cancelToken,
  });
};
