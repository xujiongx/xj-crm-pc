import { useLatest } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Options {
  value?: number;
  onEnd?: () => void;
  manual?: boolean;
  interval?: number;
  refreshDeps?: React.DependencyList;
}

export interface FormattedRes {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const parseMs = (milliseconds: number): FormattedRes => {
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds / 3600000) % 24,
    minutes: Math.floor(milliseconds / 60000) % 60,
    seconds: Math.floor(milliseconds / 1000) % 60,
    milliseconds: Math.floor(milliseconds) % 1000,
  };
};

const useCountdown = (options?: Options) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const {
    value,
    interval = 1000,
    manual = true,
    refreshDeps = [],
    onEnd,
  } = options || {};

  const [number, setNumber] = useState(value);

  const onEndRef = useLatest(onEnd);

  useEffect(() => {
    if (!value) {
      setNumber(0);
      return;
    }

    setNumber(value);
    if (!manual) {
      return;
    }

    let targetLeft = value;
    timerRef.current = setInterval(() => {
      targetLeft = targetLeft - interval;
      setNumber(targetLeft);
      if (targetLeft === 0) {
        clear();
        onEndRef.current?.();
      }
    }, interval);

    return () => clear();
  }, [value, interval, manual, ...refreshDeps]);

  const formattedRes = useMemo(() => parseMs(number || 0), [number]);

  const onPaused = () => {
    clear();
  };

  const clear = () => {
    timerRef.current && clearInterval(timerRef.current);
  };

  return { number, setNumber, formattedRes, onPaused };
};

export default useCountdown;
