import GaspPlayer from './gaspPlayer';

class GaspController {
  cacheMap: Record<string, any> = {};

  init(id: string) {
    const gaspElement = document.querySelector(`#gasp-${id}`);
    console.log('😿', id, gaspElement);
    if (!gaspElement) return;
    const item = new GaspPlayer(gaspElement, {
      duration: 1,
      progress: 0,
    });
    this.cacheMap[id] = item;

    return item;
  }

  start(data: { id: string; progress: number; duration: number }) {
    const { id, duration, progress } = data;
    let item: any;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
    } else {
      item = this.init(id);
    }
    console.log('🥺', this.cacheMap[id], this.init(id), item);
    item.updated({
      duration,
      progress,
    });
    item.start();
  }

  stop(data: { id: string }) {
    const { id } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.stop();
    }
  }

  updated(data: { id: string; progress: number; duration: number }) {
    const { id, progress, duration } = data;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.updated({
        duration,
        progress,
      });
    }
  }
}

const gaspController = new GaspController();

export default gaspController;
