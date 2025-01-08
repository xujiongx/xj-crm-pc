import { useDataDictionary } from '@aicc/hooks';
import { ChannelItem } from '@aicc/types';
import { LoadingOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { FormInstance, Typography } from 'antd';
import { pick, uniq } from 'lodash';
import { ProCard, ProTable } from 'qnzs-ui';
import type { ProColumnProps, ProTableProps } from 'qnzs-ui/es/pro-table/types';
import { FC, ReactNode, useMemo } from 'react';
import { prefix as cssPrefix, formatChannel } from '../../index';
import '../../index.less';
import { NLPAsrIndex, RecordTapeItem } from '../../interface';
import HighlightText from './highlight';
import TextCompareModal from './modal';
import Recorder from './recorder';
import Search from './search';

const { Paragraph, Text } = Typography;

export interface StateTypes {
  currentItem?: RecordTapeItem;
  pageSize: number;
  current: number;
  open?: string;
  textComparison?: {
    text: string;
    index: {
      start: number;
      end: number;
      type: 'skip' | 'surplus' | 'error';
    }[];
  };
}

interface RecordTableProps
  extends Omit<ProTableProps<RecordTapeItem>, 'toolBarRender' | 'form'> {
  robotId: string;
  readonly?: boolean;
  hideColumns?: string[];
  showSummary?: boolean;
  form?: FormInstance;
  toolBarRender: ReactNode;
  progress: { langType: string; total: number; undone: number }[];
  knowledgeType: { label: string; value: number }[];
  IconFont: FC<any>;
  recorderProps: {
    action: string;
    limitSize?: number;
    chunkSize?: number;
    extraAction?: (record: RecordTapeItem) => ReactNode;
    apiConvert: (data: FormData) => Promise<any>;
    apiUploadMinio?: (data: any) => Promise<any>;
  };
  submit: () => void;
  refresh: () => void;
  machineCoupling?: boolean;
  refreshAllUpload?: () => void;
}

//审核结果
export const Audit_Result = [
  {
    label: '审核通过',
    value: 0,
  },
  {
    label: '未提交',
    value: 4,
  },
  {
    label: '审核驳回',
    value: 2,
  },
  {
    label: '审核中',
    value: 1,
  },
];

const RecordTable: FC<RecordTableProps> = ({
  robotId,
  readonly = false,
  showSummary = true,
  form,
  toolBarRender,
  progress,
  submit,
  refresh,
  IconFont,
  recorderProps,
  knowledgeType,
  hideColumns,
  machineCoupling = false,
  refreshAllUpload,
  ...tableProps
}) => {
  const prefix = `${cssPrefix}-tape`;

  const [state, setState] = useSetState<StateTypes>({
    pageSize: 10,
    current: 1,
  });

  /** 查询渠道配置 */
  const { data: channels } = useDataDictionary<ChannelItem>(
    'skm:channel',
    {},
    formatChannel,
  );

  const channelNames = useMemo(
    () =>
      (channels as ChannelItem[])?.reduce<Record<string, string>>(
        (result, { key, title }) => {
          result[key] = title;
          return result;
        },
        {},
      ),
    [channels],
  );

  /** 生成下标连续区间 */
  const generateRange = (arr: number[], type: 'skip' | 'surplus' | 'error') => {
    if (arr.length === 1) {
      const [item] = arr;
      return [{ start: item, end: item, type }];
    }
    const indexs = uniq(arr).sort((a, b) => a - b);
    const result: RecordTapeItem['asrIndex'] = [];
    let range: number[] = [];
    for (let i = 0; i < indexs.length; i++) {
      if (indexs[i + 1] - indexs[i] === 1) {
        range.push(indexs[i]);
      } else {
        const [start] = range?.length ? range : [indexs[i]];
        result.push({ start: start, end: indexs[i], type });
        range = [];
      }
    }
    return result;
  };

  const columns: ProColumnProps<RecordTapeItem>[] = [
    {
      title: '序列',
      width: 60,
      dataIndex: 'index',
      render: (_, record, index) => {
        const { current, pageSize } = state;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'id',
      dataIndex: 'originId',
      render: (text) => (
        <Paragraph
          style={{ width: text ? 100 : 'unset', marginBottom: 0 }}
          ellipsis
          copyable={text ? { text, tooltips: text } : false}
        >
          {text || '-'}
        </Paragraph>
      ),
    },
    {
      title: '知识类型',
      width: 100,
      dataIndex: 'recordType',
      render: (text) =>
        knowledgeType?.find(({ value }) => value === text)?.label || '-',
    },
    {
      title: '知识名称',
      width: 150,
      autoEllipsis: true,
      dataIndex: 'name',
    },
    {
      title: '机器人话术',
      dataIndex: 'contentText',
      render: (text, { nlpAsrIndex }) => {
        if (!text) return '-';
        const { sc_position, th_position } = JSON.parse(
          nlpAsrIndex || '{}',
        ) as NLPAsrIndex;
        const skip = generateRange(sc_position || [], 'skip');
        const error = generateRange(
          (th_position || [])?.map((item) => item[1]),
          'error',
        );
        const index = skip.concat(error).sort((a, b) => a?.start - b?.start);
        return (
          <HighlightText
            text={text}
            index={index || []}
            ellipsis={{
              maxLength: 350,
              showMore: true,
              symbol: ['更多内容', '更多内容'],
              onExpand: () => {
                setState({
                  textComparison: { text, index },
                  open: 'textCompare',
                });
              },
            }}
          />
        );
      },
    },
    {
      title: '是否录音',
      width: 90,
      dataIndex: 'isRecord',
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus',
      hidden: !machineCoupling,
      render: (text: number) => {
        const item = Audit_Result.find((i) => i.value === text);
        return <span>{item?.label || '未提交'}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'statusText',
      hidden: hideColumns?.includes('statusText'),
      render: (text, { status }) => {
        return (
          <div className={`${prefix}-status`} data-status={status}>
            <span>{text || '-'}</span>
            {text === '进行中' ? <LoadingOutlined /> : null}
          </div>
        );
      },
    },
    {
      title: '语种',
      width: 80,
      dataIndex: 'langType',
      hidden: hideColumns?.includes('langType'),
      render: (text) => channelNames?.[text] || text,
    },
    {
      title: '录音文件名称',
      dataIndex: 'actRecordName',
      render: (text, { recordName }) => {
        const name = text || recordName;
        return (
          <Paragraph
            style={{ width: name ? 120 : 'unset', marginBottom: 0 }}
            ellipsis
            copyable={name ? { text, tooltips: name } : false}
          >
            {name || '-'}
          </Paragraph>
        );
      },
    },
    {
      title: '录音内容',
      dataIndex: 'recordText',
      render: (text, { nlpAsrIndex }) => {
        if (!text) return '-';
        const { zj_position, th_position } = JSON.parse(
          nlpAsrIndex || '{}',
        ) as NLPAsrIndex;
        const surplus = generateRange(zj_position || [], 'surplus');
        const error = generateRange(
          (th_position || [])?.map((item) => item[0]),
          'error',
        );
        const index = surplus.concat(error).sort((a, b) => a?.start - b?.start);
        return (
          <HighlightText
            text={text}
            index={index || []}
            ellipsis={{
              maxLength: 350,
              showMore: true,
              symbol: ['更多内容', '更多内容'],
              onExpand: () => {
                setState({
                  textComparison: { text, index },
                  open: 'textCompare',
                });
              },
            }}
          />
        );
      },
    },
    {
      title: '差异分值',
      dataIndex: 'nlpScore',
    },
    {
      title: '操作',
      width: 120,
      dataIndex: 'action',
      fixed: 'right',
      render: (_, record) => {
        const { recordUrl, recordName, originId, webUrl } = record;
        const { currentItem } = state;
        return (
          <Recorder
            {...recorderProps}
            params={{
              ...pick(record, [
                'recordType',
                'originId',
                'contentText',
                'langType',
                'name',
              ]),
              robotId,
            }}
            src={machineCoupling ? webUrl : recordUrl}
            disabled={
              readonly || (currentItem ? record !== currentItem : false)
            }
            extraAction={() => recorderProps?.extraAction?.(record)}
            IconFont={IconFont}
            fileName={recordName || originId}
            onStartRecord={() => setState({ currentItem: record })}
            onEndRecord={() => setState({ currentItem: undefined })}
            refresh={refresh}
            refreshAllUpload={refreshAllUpload!}
          />
        );
      },
    },
  ];

  const renderExtraRende = () => (
    <header>
      <div className={`${prefix}-toolbar`}>
        <Text>录音文件列表</Text>
        {toolBarRender}
      </div>
      {showSummary ? (
        <div className={`${prefix}-progress`}>
          <span>录音进度：</span>
          {machineCoupling ? (
            <ul>
              <li key={''}>
                <span>
                  {`共`}
                  <em data-status="total">{`${progress[0]?.total || 0}`}</em>
                  条，
                </span>
                <span>
                  <em data-status="undone">{`${
                    progress[0]?.undone || 0
                  }条`}</em>
                  未录入；
                </span>
              </li>
            </ul>
          ) : progress?.length ? (
            <ul>
              {progress.map(({ langType, total, undone }) => (
                <li key={langType}>
                  <span>
                    {`${channelNames?.[langType] || langType}共`}
                    <em data-status="total">{total}</em>条，
                  </span>
                  <span>
                    <em data-status="undone">{`${undone}条`}</em>
                    未录入；
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span>暂无数据</span>
          )}
        </div>
      ) : null}
    </header>
  );

  return (
    <ProCard className={`${prefix}`}>
      <ProTable
        {...tableProps}
        form={
          form ? (
            <Search
              form={form}
              knowledgeType={knowledgeType}
              channels={channels || []}
              onSearch={submit}
              machineCoupling={machineCoupling}
            />
          ) : null
        }
        rowKey={({ id, recordName }) => (id ? id : recordName!)}
        onChange={({ pageSize = 10, current = 1 }) => {
          setState({ current, pageSize });
        }}
        pagination={{}}
        extraRender={renderExtraRende()}
        columns={columns}
      />
      <TextCompareModal
        open={state?.open === 'textCompare'}
        data={state?.textComparison}
        onClose={() => setState({ open: undefined, textComparison: undefined })}
      />
    </ProCard>
  );
};

export default RecordTable;
