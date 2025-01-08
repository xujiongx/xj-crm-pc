import { FC, ReactNode, useMemo } from 'react';
import { useToggle } from 'ahooks';
import { Typography } from 'antd';
import { prefix } from '../../index';
import '../../index.less';

const { Link } = Typography;

export interface HighlightTextProps {
  index: {
    start: number;
    end: number;
    type: 'skip' | 'error' | 'surplus';
  }[];
  text: string;
  ellipsis?: {
    maxLength?: number;
    showMore?: boolean;
    symbol?: [ReactNode, ReactNode];
    expandable?: boolean;
    onExpand?: (data: boolean) => void;
  };
}

const HighlightText: FC<HighlightTextProps> = ({ index, text, ellipsis }) => {
  const {
    maxLength = Infinity,
    symbol,
    showMore,
    expandable,
    onExpand,
  } = ellipsis || {};

  const [more, { toggle }] = useToggle(text?.length > maxLength);

  /** 计算高亮文字 */
  const { html, ellipsisText } = useMemo(() => {
    if (!index?.length)
      return { html: text, ellipsisText: text?.slice(0, maxLength) };
    let [result, ellipsisText, count] = ['', '', 0];
    let currentIndex = 0;
    for (const { start, end, type } of index) {
      const pureText = text.substring(currentIndex, start);
      const segment = text.substring(start, end + 1);
      result += pureText;
      count += pureText?.length;
      if (count <= maxLength) {
        ellipsisText = result;
      } else if (!expandable) {
        break;
      }
      result += `<span data-text="${type}">${segment}</span>`;
      count += segment?.length;
      currentIndex = end + 1;
    }

    if (count < maxLength) {
      ellipsisText = result + text.substring(currentIndex, maxLength);
    }
    result += text.substring(currentIndex);
    return { html: result, ellipsisText };
  }, [text, index]);

  return (
    <div className={`${prefix}-highlight`}>
      <span
        dangerouslySetInnerHTML={{
          __html: more ? `${ellipsisText}...` : html,
        }}
      />
      {showMore && text?.length > maxLength ? (
        <Link
          style={{ marginLeft: 5 }}
          onClick={() => {
            if (expandable) toggle();
            onExpand?.(more);
          }}
        >
          {more ? symbol?.[0] || '更多' : symbol?.[1] || '收起'}
        </Link>
      ) : null}
    </div>
  );
};

export default HighlightText;
