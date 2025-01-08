import { FC, useState, useLayoutEffect, useRef } from 'react';
import { Tag, Space, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { CallQcResult } from '@aicc/types';
import { prefix } from '../../index';

interface UserProfileProps {
  tags: any;
}

const UserProfile: FC<UserProfileProps> = ({ tags }) => {
  const [expand, setExpand] = useState<boolean | undefined>(true);
  const continerRefs = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!continerRefs.current?.clientHeight) return;
    if (continerRefs.current.clientHeight > 35) {
      setExpand(true);
    } else {
      setExpand(undefined);
    }
  }, [tags?.length]);

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
  return (
    <div className={`${prefix}-profile`}>
      <h6>
        <span>客户画像</span>
        {expand !== undefined && tags?.length
          ? renderExpand({
              ellipsis: expand,
              text: '展开',
              onClick: () => setExpand(!expand),
            })
          : null}
      </h6>
      {tags?.length ? (
        <div
          className={`${prefix}-profile-tags ${
            expand ? `${prefix}-profile-ellipsis` : ''
          }`}
        >
          <div ref={continerRefs}>
            <Space wrap size={18}>
              {tags.map((item) => (
                <Tag key={`${item.id}-${item?.title}`}>{item?.title}</Tag>
              ))}
            </Space>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
