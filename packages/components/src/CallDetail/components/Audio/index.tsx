import {
  DownloadOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { Divider, Dropdown } from 'antd';
import clsx from 'clsx';
import React, {
  ForwardRefRenderFunction as FC,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { prefix } from '../../index';
import './index.less';

export interface NAudioProps {
  src?: string;
  bordered?: boolean;
  onPlayed?: any;
  onPaused?: () => void;
  playingLength?: any;
  download?: boolean;
  speed?: boolean;
  autoPlay?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: () => void;
}

export interface RefProps {
  currentTime: number;
  playing: boolean;
  onPlay?: (start?: number, end?: number) => void;
  onPauesd?: () => void;
}

const initState = {
  playing: false,
  canPlaying: false,
  duration: 0,
  currentTime: 0,
  currentSpeed: 1,
  timeOffset: { start: 0, end: 0 },
};

const SPEED = [0.75, 1.0, 1.25, 1.5, 2.0, 3.0];

const NAudio: FC<RefProps, NAudioProps> = (
  {
    onEnded,
    autoPlay,
    bordered,
    download = true,
    speed = true,
    src,
    onPlayed,
    onPaused,
    playingLength,
    onTimeUpdate,
  },
  ref,
) => {
  const playCountDownRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [state, setState] = useSetState(initState);

  const {
    timeOffset,
    playing,
    currentTime,
    duration,
    currentSpeed,
    canPlaying,
  } = state;

  useLayoutEffect(() => {
    setState({ ...initState });
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = state.currentSpeed;
      if (timeOffset.end) {
        audioRef.current.currentTime = timeOffset.start;
        playCountDown(timeOffset.end - timeOffset.start);
        audioRef.current.play();
        setState({ playing: true });
      }
    }
  }, [state.currentSpeed]);

  useEffect(() => {
    if (playing) {
      onPlayed?.();
    } else {
      onPaused?.();
    }
  }, [playing]);

  const onPlay = (start?: number, end?: number) => {
    if (!canPlaying) return;
    setState({
      timeOffset: {
        start: start || 0,
        end: end || 0,
      },
    });
    if (audioRef.current) {
      if (start) audioRef.current.currentTime = start;
      if (end) playCountDown(end - (start || currentTime));
      audioRef.current.play();
      setState({ playing: true });
    }
  };

  useImperativeHandle(ref, () => ({
    currentTime,
    playing,
    onPlay,
    onPauesd: pauseAudio,
  }));

  const getMinuteTime = (time: number) => {
    const timeSecond = Math.floor(time);
    const minute = Math.floor(timeSecond / 60);
    const second = timeSecond % 60;
    return `${minute < 10 ? `0${minute}` : minute}:${
      second < 10 ? `0${second}` : second
    }`;
  };

  const playCountDown = (time: number) => {
    playCountDownRef.current && clearTimeout(playCountDownRef.current);
    playCountDownRef.current = setTimeout(
      () => {
        pauseAudio();
        playCountDownRef.current && clearTimeout(playCountDownRef.current);
      },
      (time * 1000) / currentSpeed,
    );
  };

  const clearPlayCountDown = () => {
    setState({ timeOffset: { start: 0, end: 0 } });
    playCountDownRef.current && clearTimeout(playCountDownRef.current);
  };

  const playAudio = () => {
    clearPlayCountDown();
    if (audioRef.current) audioRef.current.play();
    setState({ playing: false });
  };

  const pauseAudio = () => {
    clearPlayCountDown();
    if (audioRef.current) audioRef.current.pause();
    setState({ playing: false });
  };

  const canplay = () => {
    if (audioRef.current) {
      setState({ canPlaying: true });
    }
  };

  const timeUpdate = () => {
    if (audioRef.current) {
      setState({ currentTime: audioRef.current.currentTime });
      playingLength?.(audioRef.current.currentTime);
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        setState({ playing: false });
      }
    }
    onTimeUpdate?.();
  };

  const rangeChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      setState({ currentTime: Number(value.target.value) });
      audioRef.current.currentTime = Number(value.target.value);
    }
  };

  const onError = () => {
    setState({ canPlaying: false });
  };

  const cls = clsx(`${prefix}-audio-wrapper`, {
    [`${prefix}-audio-wrapper-bordered`]: bordered,
  });

  const durationChange = (e: React.ChangeEvent<HTMLAudioElement>) => {
    setState({ duration: e.target.duration });
  };

  return (
    <div className={cls}>
      <audio
        className="naudio"
        ref={audioRef}
        src={src}
        onCanPlay={canplay}
        onError={onError}
        onTimeUpdate={timeUpdate}
        controls
        autoPlay={autoPlay}
        onEnded={onEnded}
        onPlaying={() => setState({ playing: true })}
        onDurationChange={durationChange}
      />
      <div className="operate">
        {canPlaying ? (
          playing ? (
            <PauseCircleOutlined onClick={pauseAudio} />
          ) : (
            <PlayCircleOutlined onClick={playAudio} />
          )
        ) : (
          <StopOutlined className="disabled" />
        )}
      </div>
      <input
        className="range"
        type="range"
        step="any"
        max={duration}
        value={currentTime}
        onChange={rangeChange}
        disabled={!canPlaying}
      />
      <div className="time">
        {getMinuteTime(currentTime)}
        {duration !== Infinity ? (
          <>
            <span className="hr">|</span>
            {getMinuteTime(duration)}
          </>
        ) : null}
      </div>

      {download ? (
        <>
          <Divider type="vertical" />
          <div className="download">
            <a href={src} download target="_blank">
              <DownloadOutlined />
            </a>
          </div>
        </>
      ) : null}
      {speed ? (
        <>
          <Divider type="vertical" />
          <Dropdown
            menu={{
              selectedKeys: [`${currentSpeed}`],
              items: SPEED.map((speed) => ({
                label: `${speed}倍速`,
                key: speed,
                onClick: () => setState({ currentSpeed: speed }),
              })),
            }}
          >
            <span className="speed"> x {currentSpeed}</span>
          </Dropdown>
        </>
      ) : null}
    </div>
  );
};

export default React.forwardRef<RefProps, NAudioProps>(NAudio);
