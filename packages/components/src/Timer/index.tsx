import { useState, FC, useEffect } from 'react';
import { useInterval } from 'ahooks';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

interface TimerProps {
  /** 时间戳 */
  time: number;
  start?: boolean;
  stop?: boolean;
}

const Timer: FC<TimerProps> = ({ time, start = true, stop }) => {
  const [duration, setDuration] = useState('');

  const [delay, setDelay] = useState(start ? 1000 : undefined);

  const format = (ts: number) => {
    let timestamp: dayjs.Dayjs | undefined = undefined;
    if (ts?.toString()?.length === 10) {
      timestamp = dayjs.unix(time);
    }
    const value = dayjs().diff(timestamp || ts);
    if (value < 0) return '00:00';

    const date = dayjs.duration(value);
    return date.format(`${date.hours() ? 'HH:' : ''}mm:ss`);
  };

  const clear = useInterval(
    () => {
      setDuration(format(time));
    },
    delay,
    { immediate: true },
  );

  useEffect(() => {
    if (stop) {
      clear();
      setDelay(undefined);
    } else {
      setDelay(1000);
    }
  }, [stop]);

  return <time>{duration}</time>;
};

export default Timer;
