import { request } from '@/services/crm';
import { CrmApiListResultType, CrmApiResultType } from '@aicc/types';

/**
 * 获取视频列表
 * @param params
 * @returns
 */
export async function fetchVideoList(params: Record<string, any>) {
  return request<CrmApiResultType<CrmApiListResultType<any>> | undefined>(
    '/srb/mg/video/list/page',
    {
      method: 'GET',
      params,
    },
  );
}

/**
 * 获取视频详情
 * @param id
 * @returns
 */
export async function fetchVideoDetail(id: string) {
  return request<CrmApiResultType<any | undefined>>(
    `/srb/mg/video/detail/${id}`,
  );
}

/** 创建视频*/
export function saveVideo(data: any) {
  return request<CrmApiResultType<any>>('/srb/mg/video/save', {
    method: 'POST',
    data,
  });
}
/** 更新视频 */
export function updateVideo(data: any) {
  return request<CrmApiResultType<any>>('/srb/mg/video/update', {
    method: 'PUT',
    data,
  });
}

/** 删除视频 */
export function deleteVideo(id: string) {
  return request<CrmApiResultType<any>>(`/srb/mg/video/delete/${id}`, {
    method: 'DELETE',
  });
}

/** 复制视频 */
export async function copyVideo(id: string) {
  return request<CrmApiResultType<any> | undefined>(
    `/srb/mg/video/copy/${id}`,
    {
      method: 'GET',
    },
  );
}

/** 合成重试 */
export function retryRecordingVideo(params: { id: string }) {
  return request<CrmApiResultType<any>>('/srb/mg/video/video/recording/retry', {
    method: 'GET',
    params,
  });
}

/** 合成取消 */
export function cancelRecordingVideo(params: { id: string }) {
  return request<CrmApiResultType<any>>(
    '/srb/mg/video/video/recording/cancel',
    {
      method: 'GET',
      params,
    },
  );
}
