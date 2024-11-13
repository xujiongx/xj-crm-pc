/**
 * 点击获取文件数据
 * @returns
 */
export const selectFiles = (): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.multiple = true; // 允许选择多个文件
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      resolve(Array.from(files || []));
    };
    input.oncancel = () => {
      reject('取消');
    };
    input.click();
  });
};

/**
 * 阅读文件数据，导出为Uint8Array
 * @param fileData
 * @returns
 */
export const readFile = (fileData: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        resolve(new Uint8Array(e.target.result as ArrayBuffer));
      } else {
        reject('读取失败');
      }
    };
    reader.readAsArrayBuffer(fileData);
  });
};
