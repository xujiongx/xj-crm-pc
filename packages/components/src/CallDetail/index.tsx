import { FC, useEffect, useRef, useState } from 'react';
import { Space, Typography } from 'antd';
import NAudio, { RefProps } from './components/Audio';
import Dialog from './components/Dialogue';
import type { SessionItem } from './interface';

const { Text } = Typography;

export const prefix = 'call-record';

export interface CallDetailProps {
  session?: SessionItem;
}

const CallDetail: FC<CallDetailProps> = ({ session }) => {
  const audioRef = useRef<RefProps>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    return () => {
      audioRef?.current?.onPauesd?.();
    };
  }, [session]);

  return (
    <div className={`${prefix}`}>
      <Space direction="vertical">
        <Space size={32}>
          <Text>联系人姓名: {session?.userName || '-'}</Text>
          <Text>手机号码: {session?.phone || '-'}</Text>
        </Space>
        <Typography.Text copyable={{ text: session?.id }}>
          通话Id: {session?.id}
        </Typography.Text>
      </Space>
      <div className="record">
        <NAudio
          ref={audioRef}
          src={session?.src}
          playingLength={(val: number) => setCurrentTime(val)}
        />
      </div>
      <div className={`${prefix}-dialogs`}>
        {session?.messages?.map((item) => {
          let playing = false;
          const [start, end] = item?.slots || [];
          if (
            audioRef?.current?.playing &&
            currentTime >= start &&
            currentTime < end
          ) {
            playing = true;
          }
          return (
            <Dialog
              key={item.id}
              playing={playing}
              data={item}
              onPlay={(start, end) => {
                audioRef?.current?.onPlay?.(start, end);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CallDetail;
