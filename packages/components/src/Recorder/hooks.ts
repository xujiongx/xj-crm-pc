import { useLatest } from 'ahooks';
import { message } from 'antd';
import { useRef, useState } from 'react';
import Recorder from './recorder';

interface RecorderParams {
  format?: 'wav' | 'mp3';
  minVoice?: number;
  disabled?: boolean;
  sampleRate?: 8000 | 16000;
  apiConvert?: (file: Blob) => Promise<any>;
}

const useRecorder = ({
  format,
  minVoice = 2,
  disabled,
  sampleRate,
  apiConvert,
}: RecorderParams) => {
  const countTimerRef = useRef<NodeJS.Timeout>();
  const recorderRef = useRef<Recorder>();
  const countRef = useRef(0);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(false);
  const startingRef = useLatest(starting);

  const countStart = () => {
    countTimerRef.current = setInterval(() => {
      countRef.current += 1;
    }, 1000);
  };

  const countEnd = () => {
    countRef.current = 0;
    if (countTimerRef.current) clearInterval(countTimerRef.current);
  };

  const clear = () => {
    recorderRef.current?.clear();
    recorderRef.current = undefined;
    if (countTimerRef.current) clearInterval(countTimerRef.current);
    setStarting(false);
  };

  const startRecord = () => {
    setStarting(true);
    recorderRef.current?.start();
    countStart();
  };

  const endRecord = () => {
    setStarting(false);
    // 无权限、未在录音中、无录音实例
    if (!startingRef.current || !recorderRef.current) {
      countEnd();
      return;
    }
    if (countRef.current < minVoice) {
      message.error('说话时长过短');
      clear();
      return;
    }
    countEnd();
    const blob = recorderRef.current.getBlob();
    recorderRef.current!.clear();
    setLoading(true);
    apiConvert?.(blob).finally(() => setLoading(false));
  };

  const onStart = () => {
    if (starting) {
      endRecord();
    } else {
      if (disabled) {
        message.open({
          type: 'warning',
          content: '当前已有录音正在进行，请稍后重试',
        });
        return;
      }
      if (recorderRef.current) {
        startRecord();
      } else {
        navigator.mediaDevices
          ?.getUserMedia({ audio: true })
          .then((stream) => {
            recorderRef.current = new Recorder({
              format,
              stream,
              sampleRate,
            });
            startRecord();
          })
          .catch((error) => {
            message.warning(`录音失败：${error}`);
            console.log(error);
          });
      }
    }
  };

  return {
    loading,
    starting,
    onStart,
    clear,
  };
};

export { useRecorder };
