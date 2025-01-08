import { useToggle } from 'ahooks';
import { Tag, Typography } from 'antd';
import { FC, Fragment, ReactNode, useMemo } from 'react';
import { MessageItem } from '../../interface';
import './index.less';

interface MatchDetailProps {
  fields: Array<{ label: string; value: string | number | undefined }>;
  regex: MessageItem['regex'];
  corpus: MatchDetailProps['regex'];
  showCorpusCount?: number;
  footer?: ReactNode;
}

const prefix = 'aicc-interaction-node-match';

const { Link } = Typography;

const MatchDetail: FC<MatchDetailProps> = ({
  fields,
  regex,
  corpus,
  showCorpusCount = 5,
}) => {
  const [visible, { toggle }] = useToggle(false);

  const renderChild = (
    item: Record<'title' | 'text' | 'score' | 'type', string | number>,
    index: number,
  ) => (
    <li key={`${item.text}-${index}`}>
      <Tag className={item.type === '语料' ? `${prefix}-corpus` : ''}>
        {item.type}
      </Tag>
      <div className={`${prefix}-regular`}>
        <i>{`${index + 1}、`}</i>
        <span>{`${item.title ? `${item.title} :` : ''}${item.text}`}</span>
        <strong>{item.score}</strong>
      </div>
    </li>
  );

  const lists = useMemo(
    () =>
      regex
        ?.map((item) => ({ ...item, type: '正则' }))
        .concat(
          corpus
            ?.slice(0, showCorpusCount)
            ?.map((item) => ({ ...item, type: '语料' })) || [],
        )
        ?.sort((a, b) => b.score - a.score),
    [regex, corpus],
  );

  return (
    <div className={prefix}>
      <div className={`${prefix}-info`}>
        {fields?.map(({ label, value }, index) => (
          <div
            className={`${prefix}-info-item ${
              index ? `${prefix}-info-gray` : ''
            }`}
            key={label}
          >
            <label>{label}</label>
            <div className={`${prefix}-info-item-content`}>
              <span>{value || '-'}</span>
            </div>
          </div>
        ))}
      </div>
      {lists?.length ? (
        <Fragment>
          <Link onClick={() => toggle()}>{visible ? '收起' : '命中详情'}</Link>
          {visible ? (
            <div
              className={`${prefix}-content`}
              onClick={(event) => event.stopPropagation()}
            >
              <ul>{lists?.map((item, index) => renderChild(item, index))}</ul>
            </div>
          ) : null}
        </Fragment>
      ) : null}
    </div>
  );
};

export default MatchDetail;
