import { TimelineEngine } from '@/components/react-timeline-edit';
import { Howl } from 'howler';

class AudioControl {
  cacheMap: Record<string, Howl> = {};
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
    src: string;
    startTime: number;
    time: number;
    volume?: number;
  }) {
    const { id, src, startTime, time, engine, volume = 1 } = data;
    let item: Howl;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.rate(engine.getPlayRate());
      item.seek((time - startTime) % item.duration());
      item.volume(volume);
      this.resetFadeFlags(id);
      item.fade(volume, volume, 0);
      item.play();
    } else {
      item = new Howl({ src, loop: false, autoplay: true, volume: volume });
      this.cacheMap[id] = item;
      item.on('load', () => {
        item.rate(engine.getPlayRate());
        item.seek((time - startTime) % item.duration());
      });
    }

    const timeListener = (data: { time: number }) => {
      const { time } = data;
      item.seek(time);
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.rate(rate);
    };
    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  fadeIn(data: {
    id: string;
    startTime: number;
    time: number;
    fadeDuration?: number;
    volume?: number;
  }) {
    const { id, startTime, time, fadeDuration = 0, volume = 1 } = data;
    if (!fadeDuration) return;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      if (time < startTime + fadeDuration && !item.fadeInExecuted) {
        item.fade(
          (time - startTime) / fadeDuration,
          volume,
          (startTime + fadeDuration - time) * 1000,
        );
        this.cacheMap[id].fadeInExecuted = true; // 标记 fadeIn 已执行
      }
    }
  }
  fadeOut(data: {
    id: string;
    endTime: number;
    time: number;
    fadeDuration?: number;
    volume?: number;
  }) {
    const { id, endTime, time, fadeDuration = 0, volume = 1 } = data;
    if (!fadeDuration) return;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      if (time > endTime - fadeDuration && !item.fadeOutExecuted) {
        item.fade(
          ((endTime - time) / fadeDuration) * volume,
          0,
          (endTime - time) * 1000,
        );
        this.cacheMap[id].fadeOutExecuted = true; // 标记 fadeOut 已执行
      }
    }
  }

  resetFadeFlags(id: string) {
    if (this.cacheMap[id]) {
      this.cacheMap[id].fadeInExecuted = false;
      this.cacheMap[id].fadeOutExecuted = false;
    }
  }

  stop(data: { id: string; engine: TimelineEngine }) {
    const { id, engine } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.stop();
      if (this.listenerMap[id]) {
        if (this.listenerMap[id].time) {
          engine.off('afterSetTime', this.listenerMap[id].time);
        }
        if (this.listenerMap[id].rate) {
          engine.off('afterSetPlayRate', this.listenerMap[id].rate);
        }
        delete this.listenerMap[id];
      }
    }
  }
}

const audioControl = new AudioControl();

export default audioControl;
