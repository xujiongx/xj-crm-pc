import { FC, ReactNode } from 'react';
import { Space } from 'antd';
import { CallMessageType } from '@/CallMessage/index';
import Regulation from '../Regulation';
import Recommend, { RecommendProps } from '../Recommend';
import { prefix } from '../../index';
import '../../index.less';

interface CustomerProps extends Omit<CallMessageType, 'ts'> {
  ts: string;
  avatar: ReactNode;
  onClick?: (text: string) => void;
  duration?: number;
  showIndex?: boolean;
  handleFavour?: RecommendProps['handleFavour'];
}

const Customer: FC<CustomerProps> = ({
  name,
  ts,
  result,
  regular,
  avatar,
  recommend = [],
  duration,
  showIndex,
  flow,
  onClick,
  handleFavour,
}) => {
  return (
    <div className={`${prefix} ${prefix}-user`}>
      <div className={`${prefix}-panel `}>
        <Space size={10} className={`${prefix}-meta`}>
          {avatar}
          {name ? <span className="name">{name}</span> : null}
          <time>{ts}</time>
        </Space>
        <div className={`${prefix}-content`}>
          <div
            className={`${prefix}-text`}
            style={{ cursor: onClick ? 'pointer' : undefined }}
            onClick={() => onClick?.(result)}
          >
            {result}
          </div>
          {recommend?.length ? (
            <Recommend list={recommend} handleFavour={handleFavour} />
          ) : null}

          {regular?.length || flow?.length ? (
            <Regulation
              duration={duration}
              flow={flow}
              showIndex={showIndex}
              regular={regular}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Customer;
