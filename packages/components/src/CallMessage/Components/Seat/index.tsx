import { Space } from 'antd';
import { FC } from 'react';
import { CallMessageType } from '@/CallMessage/index';
import { prefix } from '../../index';
import Recommend, { RecommendProps } from '../Recommend';
import Regulation from '../Regulation';
import '../../index.less';

interface SeatProps extends Omit<CallMessageType, 'ts'> {
  ts: string;
  userName: string;
  avatar: React.ReactNode;
  duration?: number;
  showIndex?: boolean;
  handleFavour?: RecommendProps['handleFavour'];
}

const Seat: FC<SeatProps> = ({
  duration,
  userName,
  result,
  ts,
  recommend = [],
  regular,
  avatar,
  flow,
  showIndex,
  handleFavour,
}) => {
  return (
    <div className={`${prefix} ${prefix}-seat`}>
      <div className={`${prefix}-panel`}>
        <Space size={10} className={`${prefix}-meta`}>
          {avatar}
          <span className="name">{userName || '坐席001'}</span>
          <time>{ts}</time>
        </Space>
        <div className={`${prefix}-content`}>
          <div className={`${prefix}-text`}>{result}</div>
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

export default Seat;
