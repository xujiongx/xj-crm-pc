import { FC } from 'react';
import { Tag, Space } from 'antd';
import { prefix } from '../../index';
import '../../index.less';

interface TagsProps {
  value?: Array<{
    tag_id: string;
    tag_name: string;
    is_right: boolean;
    translated_tag_text: string;
  }>;
  disabled?: boolean;
  onChange?: (data: TagsProps['value']) => void;
}

const Tags: FC<TagsProps> = ({ value = [], disabled, onChange }) => {
  const onClick = (item: Record<'tag_id' | 'tag_name', string>) => {
    if (disabled) return;
    const index = value?.findIndex(({ tag_id }) => tag_id === item.tag_id);
    if (index !== -1) {
      value[index] = {
        ...value[index],
        is_right: !value[index].is_right,
      };
      onChange?.([...value]);
    }
  };

  return (
    <Space wrap style={{ marginTop: 10 }}>
      {value?.map((item) => (
        <Tag
          className={`${prefix}-tag`}
          key={item.tag_id}
          onClick={() => onClick(item)}
        >
          {`${item.tag_name} ${
            item?.translated_tag_text ? `: ${item?.translated_tag_text}` : ''
          }`}
        </Tag>
      ))}
    </Space>
  );
};

export default Tags;
