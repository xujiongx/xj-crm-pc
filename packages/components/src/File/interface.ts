export type FileType = {
  /** 原文件名 */
  name: string;
  /** 文件地址 */
  path: string;
  /** 文件大小 */
  size?: string;
  /** 1: 视频；2：音频；3：文档；4：图片 */
  type?: number;
  /** 素材id ppt需要此id请求接口拿到图片 */
  fileSourceId?: string;
};
