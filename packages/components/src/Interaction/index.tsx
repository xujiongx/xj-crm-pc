import config from '@aicc/config';
import { ConfigContext } from '@aicc/context/es/ConfigProvider';
import { UserInfoType } from '@aicc/types';
import { useRequest } from 'ahooks';
import { Form, FormInstance } from 'antd';
import { FC, ReactNode, useContext } from 'react';
import { ChatProvider } from './context';
import { MessageItem } from './interface';
import Main from './main';

export interface InteractionProps {
  userInfo: UserInfoType;
  processInfo?: { processID: string; processName: string };
  params: Record<string, string>;
  IconFont: FC<{ type: string }>;
  open?: boolean;
  form?: FormInstance;
  avatar?: { user: any; robot: any };
  startNodeId?: string;
  queryApi?: string;
  gptApi?: string;
  onSupportBreak?: boolean;
  unRenderConditions?: boolean;
  conditions?: string[];
  sessionType?: 'text' | 'process';
  conditionExtra?: ReactNode;
  defaultActiveKey?: string | string[];
  handleItemClick?: (data: MessageItem) => void;
}

const Interaction: FC<InteractionProps> = ({
  userInfo,
  processInfo,
  params,
  form,
  queryApi,
  gptApi,
  sessionType,
  conditions,
  open,
  ...props
}) => {
  const { request } = useContext(ConfigContext);
  const [defaultForm] = Form.useForm();

  const { kbID, env, scene } = params || {};

  const query = [
    'first',
    'tenantID',
    userInfo?.enterpriseCode || '',
    ...Object.entries(processInfo || {}).flat(),
    'env',
    'product',
  ];

  const flowId = processInfo?.processID || kbID;

  /** 查询交互测试所需变量 */
  const { data: vars = [] } = useRequest(
    async () => {
      const id = `${userInfo?.enterpriseCode}_${flowId}@dev`;
      const res = await request(`${config.sdmMonkeyPrefix}/varslotlist`, {
        params: { id, isTempFlow: env !== 'prod', scene },
      });
      if (res?.code !== 0) return [];
      return res?.result;
    },
    {
      cacheKey: 'query-interaction-vars',
      ready: !!flowId && !!open,
      refreshDeps: [flowId, open, params?.env],
    },
  );

  return (
    <ChatProvider
      params={params}
      sessionType={sessionType}
      userInfo={userInfo}
      queryApi={queryApi}
      gptApi={gptApi}
    >
      <Main
        query={query}
        {...props}
        conditions={conditions || vars}
        form={form || defaultForm}
      />
    </ChatProvider>
  );
};

export default Interaction;
