class VideoPlayer {
  videoElement: any;
  options: {
    autoplay: boolean;
    loop: boolean;
    volume: number;
    playbackRate: number;
  };
  duration: any;
  currentTime: any;
  loaded: any;
  paused: boolean;
  volume: any;
  playbackRate: any;
  constructor(videoElement, options = {}) {
    this.videoElement = videoElement;
    this.options = {
      autoplay: false,
      loop: false,
      volume: 0.5,
      playbackRate: 1,
      ...options,
    };
    this.init();
  }

  async init() {
    await this.loadVideo();
    this.setupEventListeners();
  }

  async loadVideo() {
    try {
      await this.videoElement.load();
      this.duration = this.videoElement.duration;
    } catch (error) {
      console.error('Error loading video:', error);
    }
  }

  setupEventListeners() {
    this.videoElement.addEventListener(
      'durationchange',
      this.handleDurationChange,
    );
    this.videoElement.addEventListener('timeupdate', this.handleTimeUpdate);
    this.videoElement.addEventListener('ended', this.handleEnded);
    this.videoElement.addEventListener('progress', this.handleProgress);
    this.videoElement.addEventListener('error', this.handleError);
  }

  handleDurationChange = () => {
    this.duration = this.videoElement.duration;
  };

  handleTimeUpdate = () => {
    this.currentTime = this.videoElement.currentTime;
  };

  handleEnded = () => {
    if (!this.options.loop) {
      this.pause();
    } else {
      this.seek(0);
      this.play();
    }
  };

  handleProgress = () => {
    this.loaded = this.videoElement.buffered.length
      ? this.videoElement.buffered.end(this.videoElement.buffered.length - 1)
      : 0;
  };

  handleError = () => {
    console.error('Video error:', this.videoElement.error);
  };

  seek(time) {
    time = Math.max(time, 0);
    // time = Math.min(time, this.duration);
    this.videoElement.currentTime = time;
    this.currentTime = time;
  }

  play() {
    this.paused = false;
    this.videoElement.play();
  }

  pause() {
    this.paused = true;
    this.videoElement.pause();
  }

  toggle() {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  setVolume(percentage) {
    percentage = Math.max(percentage, 0);
    percentage = Math.min(percentage, 1);
    this.videoElement.volume = percentage;
    this.volume = percentage;
    if (this.videoElement.muted && percentage !== 0) {
      this.videoElement.muted = false;
    }
  }

  speed(rate) {
    this.videoElement.playbackRate = rate;
    this.playbackRate = rate;
  }
}

export default VideoPlayer;
