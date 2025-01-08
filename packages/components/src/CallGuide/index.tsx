import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Button, Empty, Tag, Timeline, Typography } from 'antd';
import {
  FC,
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useImmer } from 'use-immer';
import { TitleDivider } from '..';
import './index.less';

const { CheckableTag } = Tag;

export interface IntentionType {
  title: string | number;
  id: string | number;
  checked?: boolean;
  children: Array<{
    title: string;
    status?: 'finish' | 'undone';
    id: string | number;
    message: string[];
  }>;
}

export interface CallGuideProps {
  selectKey: string | number;
  currentFlow?: Record<'flowId' | 'subFlowId', string | number>;
  intention?: Array<IntentionType>;
  onChange?: (id: string | number) => void;
}

const prefix = 'call-guide';

const StatusMap = {
  finish: <CheckOutlined />,
  undone: <CloseOutlined />,
};

const CallGuide: FC<CallGuideProps> = ({
  intention,
  selectKey,
  currentFlow,
  onChange,
}) => {
  const [expand, setExpand] = useState<boolean | undefined>(true);
  /** 查看更多 */
  const [more, setMore] = useImmer<string[]>([]);
  const tagsRef = useRef<HTMLDivElement>(null);

  /** 截取超长文本 */
  const calcLongText = (messages: string[]) => {
    let count = 200;
    const result: string[] = [];
    for (const item of messages) {
      if (count <= 0) break;
      if (item?.length <= count) {
        result.push(item);
      } else {
        result.push(`${item.slice(0, count)}...`);
      }
      count -= item.length;
    }
    return {
      result,
      ellipsis: count <= 0,
    };
  };

  const showMore = (id: string) => {
    setMore((draft) => {
      const index = draft.indexOf(id);
      if (index !== -1) {
        draft.splice(index, 1);
      } else {
        draft.push(id);
      }
    });
  };

  /** 收起、展开 */
  const renderExpand = ({
    ellipsis,
    text,
    onClick,
  }: {
    ellipsis: boolean;
    text: string;
    onClick: () => void;
  }) => {
    return (
      <Button size="small" type="link" onClick={onClick}>
        {ellipsis ? (
          <>
            {text}
            <DownOutlined />
          </>
        ) : (
          <>
            收起
            <UpOutlined />
          </>
        )}
      </Button>
    );
  };

  const renderWords = (item: any) => {
    const dataIndex = !more.includes(item.title) ? 'result' : 'message';
    return (
      <ul>
        {item[dataIndex]?.map((msg, index) => (
          <li key={msg}>
            <div>{`${
              item.message?.length > 1 ? `话术${index + 1}、` : ''
            } ${msg}`}</div>
            {item.ellipsis && index === item[dataIndex].length - 1
              ? renderExpand({
                  ellipsis: dataIndex === 'result',
                  text: '更多',
                  onClick: () => showMore(item.title),
                })
              : null}
          </li>
        ))}
      </ul>
    );
  };

  const guide = useMemo(() => {
    const item = intention?.find((item) => item.id === selectKey);
    if (item) {
      return {
        title: item.title,
        children: item.children.map((item) => {
          const { ellipsis, result } = calcLongText(item.message);
          return {
            ...item,
            ellipsis,
            result,
          };
        }),
      };
    }
    return undefined;
  }, [intention, selectKey]);

  useEffect(() => {
    /** 滚动到当前命中的子流程 */
    if (!currentFlow || currentFlow?.flowId !== selectKey) return;
    try {
      document
        .querySelectorAll(
          `.${prefix}-flowName[data-anchor=SUB_${currentFlow?.subFlowId}]`,
        )?.[0]
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (error) {
      console.error(error);
    }
  }, [currentFlow]);

  useLayoutEffect(() => {
    if (!tagsRef.current?.clientHeight) return;
    if (tagsRef.current.clientHeight > 32) {
      setExpand(true);
    } else {
      setExpand(undefined);
    }
  }, [intention?.length]);

  return (
    <div className={prefix}>
      <TitleDivider
        title="流程导航"
        subTitle={guide?.title ? `（${guide?.title}）` : ''}
        extra={
          expand !== undefined && intention?.length
            ? renderExpand({
                ellipsis: expand,
                text: '展开',
                onClick: () => setExpand(!expand),
              })
            : null
        }
      />
      {!intention?.length && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无流程导航"
        />
      )}
      <div className={`${prefix}-tags ${expand ? `${prefix}-ellipsis` : ''}`}>
        <div className={`${prefix}-checkes`} ref={tagsRef}>
          {intention?.map((item) => (
            <CheckableTag
              key={item.id}
              checked={item.checked === true}
              onChange={() => onChange?.(item.id)}
            >
              {item.title}
            </CheckableTag>
          ))}
        </div>
      </div>
      <Timeline
        className={`${prefix}-guide`}
        items={guide?.children.map((item, index) => ({
          key: item.id,
          color: '#E2E2E3',
          dot: (
            <div
              className={`${prefix}-dot ${
                item.status ? `${prefix}-dot-${[item.status]}` : ''
              }`}
            >
              {item.status ? StatusMap[item.status!] : index + 1}
            </div>
          ),
          children: (
            <Fragment>
              <Typography.Text
                className={`${prefix}-flowName`}
                data-anchor={`SUB_${item.id}`}
                style={{ fontSize: 16 }}
              >
                {item.title}
              </Typography.Text>
              {renderWords(item)}
            </Fragment>
          ),
        }))}
      />
    </div>
  );
};

export default CallGuide;
