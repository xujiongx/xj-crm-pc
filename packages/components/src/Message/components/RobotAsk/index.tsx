import { memo, FC } from 'react';
import { RobotAskItem } from '@aicc/types';
import { MessageProps } from '../../message';
import './index.less';

interface RobotAskProps {
  list: Array<RobotAskItem>;
  onSelect?: MessageProps['onSelect'];
}

const RobotAsk: FC<RobotAskProps> = (props) => {
  const { list, onSelect } = props;

  const heightLightStr = (str: string, keyword: Array<string>) => {
    if (!keyword.length) return str;
    let res = '';
    keyword
      ?.sort((a, b) => b.length - a.length)
      .forEach((item) => {
        res = str.replace(item, `<span class="height-light">${item}</span>`);
      });
    return res;
  };

  return (
    <ul className="text-message-robot">
      {list?.map((item, index) => (
        <li
          key={item.ID || index}
          onClick={(event) => onSelect?.(item.Ask, event, item)}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: heightLightStr(item.Ask, item.Keyword || []),
            }}
          />
        </li>
      ))}
    </ul>
  );
};

export default memo(RobotAsk);
