import { FC } from 'react';
import { useRequest } from 'ahooks';
import { Input } from 'antd';
import type { AgentApiResultType } from '@aicc/types';
import KnowledgeList from './list';
import { prefix } from '../../index';
import './index.less';

const { Search } = Input;

export interface KnowledgeItem {
  content: String;
  fileInfo: string;
  ask: string;
  intent: string;
  typeData: string;
}

interface KnowledgeProps {
  service: (query: string) => Promise<AgentApiResultType<KnowledgeItem[]>>;
}

const Knowledge: FC<KnowledgeProps> = ({ service }) => {
  const {
    data = [],
    loading,
    run,
  } = useRequest(async (query?: string) => {
    if (!query) return [];
    const res = await service(query);
    if (res?.code !== 0) return [];
    return res?.result?.map(
      ({ intent, content, fileInfo, typeData }, index) => ({
        ask: intent,
        answer: JSON.stringify([
          {
            key: 'default',
            content: content,
            fileList: JSON.parse(fileInfo || '[]'),
          },
        ]),
        category: typeData,
        id: `${intent}-${index}`,
      }),
    );
  });

  return (
    <div className={`${prefix}-knowledge`}>
      <Search
        placeholder="请输入关键字进行查询"
        allowClear
        enterButton="查询"
        loading={loading}
        onSearch={(value) => run(value)}
      />
      <KnowledgeList loading={loading} list={data} />
    </div>
  );
};

export default Knowledge;
