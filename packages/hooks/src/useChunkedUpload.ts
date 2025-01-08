import {
  ConfigContext,
  ConfigProviderProps,
} from '@aicc/context/es/ConfigProvider';
import type { CrmApiResultType } from '@aicc/types';
import type { RcFile, UploadFile } from 'antd/lib/upload';
import { useContext, useRef, useState } from 'react';
import { RequestMethod } from 'umi-request';

/** 文件上传状态 */
interface UploadFileStatus {
  name: string;
  status: 'waiting' | 'uploading' | 'done' | 'error';
  src?: string;
}
interface UploadChunkInfo {
  uploadId: string;
  fileName: string;
  file: RcFile;
  chunkSize: number;
  uploadUrls: string[];
  fragmentationFileName?: string;
}

interface ChunkFileItem {
  fileName: string;
  chunkSize: number;
  file: RcFile;
}

type UploadResult = {
  [K in 'src' | 'minioName' | 'originName']: string;
};

/**
 * 单个文件分片上传minio
 * @param chunkSize 分片大小
 * @returns minio文件地址
 */
class ChunkedUpload {
  currentChunk: number;
  totalChunks: number;
  retryCount: number;
  chunkSize: number;
  state?: {
    chunks: { stream: Blob; uploadPath: string }[];
    chunkInfo: Omit<UploadChunkInfo, 'file'>;
  };
  request: RequestMethod;
  controller?: AbortController;

  constructor(
    chunkSize = 5 * 1024 * 1024,
    request: RequestMethod,
    controller?: AbortController,
  ) {
    this.state = undefined;
    this.request = request;
    this.chunkSize = chunkSize;
    this.currentChunk = 0;
    this.totalChunks = 0;
    this.retryCount = 0;
    this.controller = controller || new AbortController();
  }

  private getChunks(file: RcFile) {
    let startSize = 0;
    let chunks: Blob[] = [];
    while (startSize < file.size) {
      const parts = file.slice(
        startSize,
        Math.min((startSize += this.chunkSize), file.size),
      );
      if (parts.size > 0) chunks.push(parts);
    }
    return chunks;
  }

  private uploadChunk = async () =>
    new Promise<string | void>(async (resolve, reject) => {
      const uploader = async () => {
        const { chunks } = this.state || {};
        if (!chunks?.length) return reject('文件不存在');
        const { stream, uploadPath } = chunks[this.currentChunk];
        try {
          const res = await fetch(uploadPath, {
            signal: this.controller?.signal,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: stream,
          });
          if (res?.status !== 200) return reject('上传失败');
          this.retryCount = 0;
          this.currentChunk += 1;
          /** 分片上传完成 */
          if (this.currentChunk === this.totalChunks) return resolve();
          await uploader();
        } catch (error) {
          if (error.name === 'AbortError') return reject('取消上传');
          console.log(error, '分片上传失败, 重新上传中。。。');
          if (this.retryCount >= 2) return reject('上传失败');
          this.retryCount += 1;
          await uploader();
        }
      };
      uploader();
    });

  private async mergeChunk() {
    const { chunkInfo } = this.state || {};
    const res = await this.request<CrmApiResultType<string>>(
      '/file/upload/completeMultipartUpload',
      {
        signal: this.controller?.signal,
        method: 'POST',
        data: {
          uploadId: chunkInfo?.uploadId,
          fileName: chunkInfo?.fragmentationFileName,
        },
      },
    );
    if (res?.code !== 0 || !res?.result) return;
    return {
      src: res?.result,
      minioName: chunkInfo?.fragmentationFileName || '',
      originName: chunkInfo?.fileName || '',
    };
  }

  public async startUpload(
    file: RcFile,
    chunkInfo: Omit<UploadChunkInfo, 'file'>,
  ) {
    try {
      const { uploadUrls } = chunkInfo;
      const chunks = this.getChunks(file);
      this.state = {
        chunks: chunks.map((stream, index) => ({
          stream,
          uploadPath: uploadUrls[index],
        })),
        chunkInfo,
      };
      this.totalChunks = uploadUrls?.length || 0;
      await this.uploadChunk();
      const fileInfo = await this.mergeChunk();
      return fileInfo;
    } catch (error) {
      console.log(error);
    }
  }

  public async cancelUpload() {
    this.controller?.abort();
  }
}

/**
 * 文件批量上传minio
 * @param concurrency 并发数
 * @param limitSize 文件超过多少M，走分片上传逻辑
 * @param chunkSize minio分片上传大小
 * @returns minio文件地址
 */
const useUploadQueue = (options: {
  concurrency?: number;
  limitSize?: number;
  chunkSize?: number;
}) => {
  const { request } = useContext<ConfigProviderProps>(ConfigContext);
  const { concurrency = 1, limitSize = 5, chunkSize = 5 } = options;

  const [files, updateFiles] = useState<UploadFileStatus[]>([]);

  const controller = useRef(new AbortController());
  /** 分片上传大小 */
  const size = chunkSize * 1024 * 1024;

  let queueIndex = 0;
  const queue: UploadChunkInfo[] = [];
  const uploadPromise: Promise<UploadResult[] | undefined>[] = [];

  const nextOutQueue = async () => {
    const results: UploadResult[] = [];

    while (queueIndex < concurrency && queue?.length) {
      queueIndex += 1;
      const { file, ...rest } = queue.shift()!;
      /** 文件状态上传中 */
      updateFiles((draft) => {
        const item = draft?.find(({ name }) => name === file.name);
        if (item) Object.assign(item, { status: 'uploading' });
        return [...draft];
      });
      const uploadChunk = new ChunkedUpload(size, request, controller.current);
      const result = await uploadChunk.startUpload(file, rest);
      queueIndex -= 1;
      if (result) results.push(result);
      updateFiles((draft) => {
        const item = draft?.find(({ name }) => name === file.name);
        if (item) {
          Object.assign(item, {
            status: result ? 'done' : 'error',
            src: result?.src,
          });
        }
        return [...draft];
      });
    }
    return results;
  };

  const addToQueue = async (data: UploadChunkInfo) => {
    queue.push(data);
    uploadPromise.push(nextOutQueue());
  };

  /** 不走分片上传接口 */
  const uploadeFile = async (files: UploadFile[]) => {
    if (!files?.length) return;
    const formData = new FormData();
    files?.forEach((file) => {
      formData.append('files', (file?.originFileObj || file) as any);
    });

    const names = files.reduce<Record<string, UploadFileStatus>>(
      (result, item) => {
        result[item.name] = {
          name: item.name,
          status: 'uploading',
        };
        return result;
      },
      {},
    );

    /** 上传中 */
    updateFiles((draft) => {
      draft.forEach((item) => {
        if (names[item.name]) {
          Object.assign(item, names[item.name]);
        }
      });
      return [...draft];
    });

    const res = await request<
      CrmApiResultType<{ url: string; fileName: string }[]>
    >('/file/upload/uploadAudioFile', {
      signal: controller?.current?.signal,
      method: 'POST',
      data: formData,
    });
    if (res?.code !== 0) {
      /** 上传失败 */
      updateFiles((draft) => {
        draft.forEach((item) => {
          if (names[item.name]) {
            Object.assign(item, { ...names[item.name], status: 'error' });
          }
        });
        return [...draft];
      });
      return;
    }

    const result = res?.result?.map(({ fileName, url }) => {
      const minioName = url.split('/')?.pop();
      names[fileName] = {
        name: fileName || minioName!,
        status: 'done',
        src: url,
      };
      return {
        src: url,
        minioName,
        originName: fileName || minioName!,
      };
    });
    updateFiles((draft) => {
      draft.forEach((item) => {
        if (names[item.name]) {
          const { status } = names[item.name];
          Object.assign(item, {
            ...names[item.name],
            status: status === 'done' ? status : 'error',
          });
        }
      });
      return [...draft];
    });
    return result;
  };

  const initChunck = async (chunkFiles: ChunkFileItem[]) => {
    if (!chunkFiles?.length) return [];
    const res = await request<
      CrmApiResultType<Omit<UploadChunkInfo, 'file'>[]>
    >('/file/upload/createMultipartUpload', {
      method: 'POST',
      signal: controller?.current?.signal,
      data: chunkFiles?.map(({ file, ...rest }) => rest),
    });
    if (res?.code !== 0) return;
    for (const item of res?.result || []) {
      const { file, chunkSize } = chunkFiles.find(
        ({ fileName }) => item.fileName === fileName,
      )!;
      addToQueue({
        ...item,
        chunkSize,
        file: file!,
      });
    }
    const result = await Promise.all(uploadPromise);
    return result?.flat()?.filter((src) => src) as UploadResult[];
  };

  const initUpload = async (fileList: UploadFile[]) => {
    if (!fileList?.length) return;
    const { chunkFiles, defaultFiles, files } = fileList?.reduce<{
      defaultFiles: UploadFile[];
      chunkFiles: ChunkFileItem[];
      files: UploadFileStatus[];
    }>(
      (result, file) => {
        result.files.push({
          status: 'waiting',
          name: file.name,
        });

        if (file.size! > limitSize * 1024 * 1024) {
          const chunkCount = Math.ceil((file?.size || 0) / size);
          result.chunkFiles.push({
            fileName: file.name,
            chunkSize: chunkCount,
            file: file.originFileObj! || file,
          });
        } else {
          result.defaultFiles.push(file);
        }
        return result;
      },
      { chunkFiles: [], defaultFiles: [], files: [] },
    );
    updateFiles(files);
    try {
      const src = (await uploadeFile(defaultFiles)) || [];
      const result = (await initChunck(chunkFiles)) || [];
      return src.concat(result)?.filter((item) => item);
    } catch (error) {
      console.log(error, 'initUpload');
    }
  };

  const cancelUpload = () => {
    controller?.current?.abort(new Error('取消上传'));
    queue.length = 0;
    uploadPromise.length = 0;
    updateFiles((draft) => {
      draft.forEach((file) => {
        if (['uploading', 'waiting'].includes(file.status)) {
          Object.assign(file, { status: 'error' });
        }
      });
      return [...draft];
    });
  };

  return {
    files,
    initUpload,
    cancelUpload,
  };
};

export { ChunkedUpload, useUploadQueue };
