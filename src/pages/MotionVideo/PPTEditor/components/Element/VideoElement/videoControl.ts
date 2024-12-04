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

  start(data: {
    id: string;
    engine: TimelineEngine;
    startTime: number;
    time: number;
  }) {
    const { id, startTime, time, engine } = data;
    let item: any;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.speed(engine.getPlayRate());
      item.seek(time - startTime);
      item.play();
    } else {
      const videoElement = document.querySelector(`#video-${id}`);
      item = new VideoPlayer(videoElement, {
        autoplay: false,
        loop: false,
      });
      this.cacheMap[id] = item;
      item.play();
      item.speed(engine.getPlayRate());
      item.seek(time - startTime);
    }

    const timeListener = (data: { time: number; engine }) => {
      console.log('👗data', data);
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
    const { id, engine } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.pause();
      // if (this.listenerMap[id]) {
      //   this.listenerMap[id].time &&
      //     engine.off('afterSetTime', this.listenerMap[id].time);
      //   this.listenerMap[id].rate &&
      //     engine.off('afterSetPlayRate', this.listenerMap[id].rate);
      //   delete this.listenerMap[id];
      // }
    }
  }
}

export default new VideoPlayerControl();
