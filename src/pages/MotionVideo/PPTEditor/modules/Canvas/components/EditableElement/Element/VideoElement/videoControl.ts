import { TimelineEngine } from '@/components/react-timeline-edit';
import VideoPlayer from './videoPlayer';

class VideoPlayerControl {
  cacheMap: Record<string, any> = {};
  listenerMap: Record<
    string,
    {
      time?: (data: { time: number }) => void;
      rate?: (data: { rate: number }) => void;
    }
  > = {};

  init(id: string) {
    const target = document.querySelector(`#element-${id}`);
    const videoElement = target?.querySelector('video');
    if (!videoElement) return;
    const item = new VideoPlayer(videoElement, {
      autoplay: true,
      loop: false,
    });
    this.cacheMap[id] = item;
  }

  start(data: {
    id: string;
    engine: TimelineEngine;
    startTime: number;
    time: number;
  }) {
    const { id, startTime, time, engine } = data;
    let item: any;
    if (!this.cacheMap[id]) return;
    item = this.cacheMap[id];
    item.speed(engine.getPlayRate());
    item.seek(time - startTime);
    item.play();

    const timeListener = (data: { time: number; engine }) => {
      const { time } = data;
      item.seek(time - startTime);
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.speed(rate);
    };
    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  stop(data: { id: string; engine: TimelineEngine }) {
    const { id } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.pause();
    }
  }
  clean() {
    this.listenerMap = {};
    this.cacheMap = {};
  }
  cleanById(id: string) {
    delete this.listenerMap[id];
    delete this.cacheMap[id];
  }
}

export default new VideoPlayerControl();
