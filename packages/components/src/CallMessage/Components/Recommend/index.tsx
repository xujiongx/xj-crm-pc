import { renderWeChatMessage } from '@aicc/shared';
import {
  DislikeOutlined,
  DownOutlined,
  LikeOutlined,
  PaperClipOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Button, Collapse, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CallMessageType, prefix } from '../../index';
import '../../index.less';

export interface RecommendProps {
  list: NonNullable<CallMessageType['recommend']>;
  /** 默认显示个数 */
  count?: number;
  source?: 'call' | 'text';
  onSend?: (val: RecommendProps['list'][0]) => void;
  onCopy?: (val: RecommendProps['list'][0]) => void;
  handleFavour?: (data: {
    item: RecommendProps['list'][0];
    favStatus: 0 | 1 | 2;
  }) => Promise<any>;
}

const Recommend: FC<RecommendProps> = ({
  list,
  count = 2,
  source = 'call',
  onSend,
  onCopy,
  handleFavour,
}) => {
  const [status, setStatus] = useSetState<Record<string, 0 | 1 | 2>>({});
  const [more, setMore] = useState(list?.length > count);

  const renderContent = (item: RecommendProps['list'][0]) => {
    if (item.isGraphic) {
      const content = JSON.parse(item.content || '{}');
      return (
        <div
          dangerouslySetInnerHTML={{ __html: renderWeChatMessage(content) }}
        />
      );
    }
    return (
      <span
        className={`${prefix}-recommend-item-answer`}
        dangerouslySetInnerHTML={{ __html: item.content || '暂无答案' }}
      />
    );
  };

  const onLike = async (item: RecommendProps['list'][0], type: 0 | 1 | 2) => {
    if (!handleFavour || !item.id) return;
    if (source === 'text' && !!status[item.id]) return;
    const favStatus = status[item.id] === type ? 0 : type;
    const res = await handleFavour?.({ item, favStatus });
    if (res?.code !== 0) return;
    setStatus({ [item.id]: favStatus });
  };

  useEffect(() => {
    if (!list?.length) return;
    setStatus(
      list?.reduce<Record<string, 0 | 1 | 2>>((result, { favStatus, id }) => {
        if (id) result[id] = favStatus || 0;
        return result;
      }, {}),
    );
  }, [list]);

  const hasMore = list?.length > count;

  if (!list?.length) return null;

  return (
    <div className={`${prefix}-recommend`}>
      <div
        className={`${prefix}-recommend-panel ${
          hasMore ? `${prefix}-recommend-more` : ''
        }`}
      >
        <Collapse
          expandIconPosition="end"
          items={list?.map((item, index) => ({
            label: item.title,
            style: { display: more && index + 1 > count ? 'none' : 'block' },
            key: index,
            children: (
              <div className={`${prefix}-recommend-item`} key={index}>
                {renderContent(item)}
                {item?.fileList?.length ? (
                  <div className={`${prefix}-recommend-item-files`}>
                    <div className={`${prefix}-recommend-item-lists`}>
                      {item?.fileList?.map((file) => (
                        <Typography.Link
                          key={file.uid}
                          ellipsis
                          href={file.response.msg}
                          download
                        >
                          <PaperClipOutlined />
                          <span>{file.name}</span>
                        </Typography.Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={`${prefix}-recommend-item-footer`}>
                  <LikeOutlined
                    className={
                      status?.[item.id!] === 1
                        ? `${prefix}-recommend-item-active`
                        : ''
                    }
                    onClick={handleFavour ? () => onLike?.(item, 1) : undefined}
                  />
                  <DislikeOutlined
                    className={
                      status?.[item.id!] === 2
                        ? `${prefix}-recommend-item-active`
                        : ''
                    }
                    onClick={handleFavour ? () => onLike?.(item, 2) : undefined}
                  />
                  {onCopy && !item?.isGraphic ? (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onCopy(item)}
                    >
                      复制
                    </Button>
                  ) : null}
                  {onSend ? (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onSend(item)}
                    >
                      发送
                    </Button>
                  ) : null}
                </div>
              </div>
            ),
          }))}
        />
        {hasMore ? (
          <div className={`${prefix}-recommend-collapse`}>
            <Typography.Link onClick={() => setMore(!more)}>
              {more ? '展开' : '收起'}
              {more ? <UpOutlined /> : <DownOutlined />}
            </Typography.Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Recommend;
