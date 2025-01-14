import gsap from 'gsap';

class GaspPlayer {
  gaspElement: HTMLElement;
  options: any;
  gapsEngine: gsap.core.Tween;

  constructor(element, options) {
    this.gaspElement = element;
    this.options = options;
    this.init();
  }
  init() {
    this.gapsEngine = gsap
      .to(this.gaspElement, {
        x: 200,
        rotation: 360,
        duration: this.options.duration,
      })
      .pause();
  }

  start() {
    this.gapsEngine.play();
  }

  updated({ progress, duration }) {
    this.gapsEngine.duration(duration);
    this.gapsEngine.progress(progress);
  }

  stop() {
    this.gapsEngine.pause();
  }

  leave() {
    this.gapsEngine.pause();
  }
}

export default GaspPlayer;
