import { request } from '@/services/crm';
import { CrmApiResultType } from '@aicc/types';

/** 新增视频，创建，更新 */
export function saveOrUpdate(data: any) {
  return request<CrmApiResultType<any>>('/srb/mg/video/saveOrUpdate', {
    method: 'POST',
    data,
  });
}

/** 导出视频 */
export function recordingVideo(data: any) {
  return request<CrmApiResultType<any>>('/srb/mg/video/video/recording', {
    method: 'POST',
    data,
  });
}

// /srb/mg/files/list

export function fetchFileList(params: any) {
  return request<CrmApiResultType<any>>('/srb/mg/files/list', {
    method: 'GET',
    params,
  });
}

/** 删除视频 */
export function deleteFile(id: string) {
  return request<CrmApiResultType<any>>(`/srb/mg/files/delete`, {
    method: 'DELETE',
    params: { id },
  });
}
