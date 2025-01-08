import { FC } from 'react';
import { MessageProps } from '../../message';
import './index.less';

interface BranchProps {
  labels: Array<string>;
  style: 0 | 1 | 2;
  onSelect?: MessageProps['onSelect'];
}

const styleMap = {
  0: 'block',
  1: 'inline-block',
  2: 'text',
};

const RobotBranch: FC<BranchProps> = ({ labels, style, onSelect }) => {
  const renderText = (val: string) => {
    switch (style) {
      /** 一列布局，最多显示14个字符 */
      case 0:
        return val?.slice(0, 14);
      /** 2列布局，最多显示7个字符 */
      case 1:
        return val?.slice(0, 7);
      case 2:
        return val;
      default:
        return val;
    }
  };

  return (
    <ul className={`branch ${styleMap[style]}`}>
      {labels?.map((item) => (
        <li key={item} onClick={(event) => onSelect?.(item, event)}>
          {renderText(item)}
        </li>
      ))}
    </ul>
  );
};

export default RobotBranch;
