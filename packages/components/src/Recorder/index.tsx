import { downloadNoSignUrlFile } from '@aicc/shared';
import {
  LoadingOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useSetState, useThrottleFn } from 'ahooks';
import {
  Button,
  Dropdown,
  MenuProps,
  Slider,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import {
  Fragment,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useRecorder } from './hooks';
import './index.less';

const { Link } = Typography;

const prefix = 'recorder';

interface StateType {
  status: 'playing' | 'paused' | 'end';
  duration: number;
  playbackRate: number;
  currentTime: number;
}
export interface RefProps {
  onPausedAll: (mode?: 'all') => void;
}

const playbackRate = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const geHoursTime = (time: number) => {
  const timeSecond = Math.floor(time);
  const minute = Math.floor(timeSecond / 60);
  const minutes = minute % 60 < 10 ? `0${minute % 60}` : minute % 60;
  const hour = Math.floor(timeSecond / 3600);
  const hours = hour ? `${hour < 10 ? `0${hour}` : hour}:` : '';
  const second = timeSecond % 60;
  return `${hours}${minutes}:${second < 10 ? `0${second}` : second}`;
};

type RecorderAudioProps = {
  format?: 'wav' | 'mp3';
  // 最短说话时长
  minVoice?: number;
  sampleRate?: number;
  src?: string;
  recordId?: string;
  disabled?: boolean;
  autoPlay?: boolean;
  fileName?: string;
  showSlider?: boolean;
  onStartRecord?: () => void;
  onEndRecord?: () => void;
  speedIcon: ReactNode;
  recordIcon: ReactNode;
  extraAction?: ReactNode;
  apiConvert?: (file: Blob) => Promise<any>;
  onChangeStatus?: (data: StateType) => void;
};

const RecorderAudio = forwardRef<RefProps, RecorderAudioProps>(
  (
    {
      format,
      minVoice,
      fileName,
      sampleRate = 8000,
      src,
      disabled,
      onStartRecord,
      onEndRecord,
      apiConvert,
      speedIcon,
      recordIcon,
      showSlider,
      autoPlay = false,
      onChangeStatus,
    },
    ref,
  ) => {
    const [canPlay, setCanPlay] = useState(false);
    const [state, setState] = useSetState<StateType>({
      status: 'paused',
      duration: 0,
      playbackRate: 1,
      currentTime: 0,
    });
    const audioRef = useRef<HTMLAudioElement>(null);
    const { loading, starting, onStart, clear } = useRecorder({
      format,
      minVoice,
      disabled,
      sampleRate,
      apiConvert,
    });

    useEffect(() => {
      if (starting) {
        onStartRecord?.();
      } else {
        !loading && onEndRecord?.();
      }
    }, [starting, loading]);

    useEffect(() => {
      return () => {
        clear();
        onEndRecord?.();
      };
    }, []);

    const onPausedAll = (type?: 'all') => {
      const elements = document.querySelectorAll<HTMLAudioElement>(
        `.${prefix}-audio`,
      );
      for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        if (type === 'all') {
          item?.pause();
          item.currentTime = 0;
        } else if (audioRef?.current !== elements[i] && !item?.paused) {
          item?.pause();
          item.currentTime = 0;
        }
      }
    };

    const onPlay = () => {
      if (!canPlay) return;
      onPausedAll();
      if (audioRef.current?.paused) {
        audioRef.current.play();
        setState({ status: 'playing' });
      } else {
        audioRef.current?.pause();
        setState({ status: 'paused' });
      }
    };

    const { run: handleTimeUpdate } = useThrottleFn(
      () => {
        if (!audioRef.current) return;
        const { currentTime: time } = audioRef.current;
        setState({ currentTime: time || 0 });
      },
      { wait: 200 },
    );

    const handleClick: MenuProps['onClick'] = ({ key, keyPath }) => {
      if (key === 'download') {
        downloadNoSignUrlFile(src, fileName);
      } else if (keyPath?.includes('speed')) {
        audioRef.current!.playbackRate = parseFloat(key);
      }
    };

    const renderOperates = () => {
      if (loading)
        return (
          <Button type="link" icon={<LoadingOutlined />}>
            录音生成中...
          </Button>
        );
      if (starting)
        return speedIcon ? (
          <div className={`${prefix}-recording`} onClick={onStart}>
            <Button type="text" style={{ padding: 0 }} icon={speedIcon} />
            <Link>正在录音中...</Link>
          </div>
        ) : null;
      return (
        <>
          {recordIcon ? (
            <Tooltip title={src ? '重新录制' : '开始录音'}>
              <Button
                type="text"
                style={{ padding: 0 }}
                onClick={onStart}
                disabled={disabled}
                icon={recordIcon}
              />
            </Tooltip>
          ) : null}

          {src ? (
            <>
              {state?.status !== 'playing' ? (
                <Tooltip
                  title={`录音时长: ${geHoursTime(
                    parseInt(`${state.duration}`),
                  )}`}
                >
                  <PlayCircleOutlined onClick={onPlay} />
                </Tooltip>
              ) : (
                <PauseCircleOutlined onClick={onPlay} />
              )}
              <Dropdown
                menu={{
                  selectedKeys: [`${state?.playbackRate}`],
                  items: [
                    { label: '下载', key: 'download' },
                    {
                      label: '播放速度',
                      key: 'speed',
                      children: playbackRate?.map((rate) => ({
                        key: rate,
                        label: `${rate}倍速`,
                      })),
                    },
                  ],
                  onClick: handleClick,
                }}
              >
                <MoreOutlined style={{ cursor: 'pointer' }} />
              </Dropdown>
            </>
          ) : null}
        </>
      );
    };

    useEffect(() => {
      onChangeStatus?.(state);
    }, [state]);

    useImperativeHandle(ref, () => ({
      onPausedAll,
    }));

    return (
      <div className={`${prefix}-container`}>
        {src ? (
          <Fragment>
            <audio
              ref={audioRef}
              autoPlay={autoPlay}
              className={`${prefix}-audio`}
              src={src}
              onCanPlay={() => setCanPlay(true)}
              onPlay={() => {
                if (!canPlay) return;
                onPausedAll();
                setState({ status: 'playing' });
              }}
              onEnded={() => setState({ status: 'end' })}
              onPause={() => setState({ status: 'paused' })}
              onRateChange={() =>
                setState({
                  playbackRate: audioRef?.current?.playbackRate || 1,
                })
              }
              onTimeUpdate={() => handleTimeUpdate()}
              onDurationChange={() =>
                setState({ duration: audioRef?.current?.duration || 0 })
              }
            />
            {showSlider ? (
              <div className={`${prefix}-slider`}>
                <Slider
                  value={state?.currentTime}
                  min={0}
                  step={0.1}
                  max={parseInt(`${state?.duration || 0}`)}
                  tooltip={{ formatter: (val) => geHoursTime(val || 0) }}
                  onChange={(val) => {
                    if (!audioRef.current) return;
                    audioRef.current.currentTime = val;
                    setState({ currentTime: val });
                  }}
                />
                <span className={`${prefix}-slider-time`}>{`${geHoursTime(
                  state?.currentTime || 0,
                )}|${geHoursTime(state?.duration || 0)}`}</span>
              </div>
            ) : null}
          </Fragment>
        ) : null}
        <Space size={10} align="center">
          {renderOperates()}
        </Space>
      </div>
    );
  },
);

export { RecorderAudio, useRecorder };
