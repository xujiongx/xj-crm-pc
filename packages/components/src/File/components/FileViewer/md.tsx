import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { FC } from 'react';
import { ViewerProps } from '.';
import MarkdownText from '../../../Message/Markdown';

const MarkdownView: FC<ViewerProps> = ({ src }) => {
  const { loading, data } = useRequest(async () => {
    const res = await fetch(src!, {
      method: 'GET',
    });
    if (res?.status !== 200)
      return '无法预览此文件，它可能已损坏，或为未知文件格式';
    return res.text();
  });

  return (
    <Spin spinning={loading} tip="文档打开中">
      <MarkdownText text={data || ''} />
    </Spin>
  );
};

export default MarkdownView;
