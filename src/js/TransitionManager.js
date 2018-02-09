import animatedScrollTo from 'animated-scrollto';
import { MDCLinearProgress } from '@material/linear-progress';

const defaultConfig = {
  scrollSpeed: 233,
  fadeSpeed: 233,
  loadingAnimation: {
    elementId: '.mdc-linear-progress',
  }
}

export default class TransitionManager {
  constructor(config = defaultConfig) {
    this.config = { ...config, ...defaultConfig };
    this._progressBarEl = document.querySelector(this.config.loadingAnimation.elementId);
    this._progressBar = new MDCLinearProgress(this._progressBarEl);
    this._loadingProgress = this._loadingProgress.bind(this);
    this._progressBar.buffer = 1;
    this._progressBar.close();
  }

  _loadingProgress() {
    if (this._currentProgress >= .7) {
      clearInterval(this._loadingProgressIntervalId);
    }
    this._currentProgress += .1;
    this._progressBar.progress = this._currentProgress;
  }

  showLoadingAnimation() {
    this._progressBar.progress = 0;
    this._progressBar.open();
    this._currentProgress = .25;
    this._progressBar.progress = .25;
    this._loadingProgressIntervalId = setInterval(this._loadingProgress, 1000);
  }

  hideLoadingAnimation(isSuccess = true) {
    clearInterval(this._loadingProgressIntervalId);
    const progressBarTarget = isSuccess ? 1 : 0;
    this._progressBar.progress = progressBarTarget;
    const onTransitionEnd = () => {
      this._progressBarEl.removeEventListener('transitionend', onTransitionEnd);;
      this._progressBar.close();
    }
    this._progressBarEl.addEventListener('transitionend', onTransitionEnd);;
  }

  fadeContent(container, className) {
    return new Promise((resolve, reject) => {
      container.classList.toggle(className);
      container.addEventListener('transitionend', () => {
        resolve(container);
      })
    });
  }

  scrollTop(speed) {
    return new Promise((resolve, reject) => {
      animatedScrollTo(document.scrollingElement, 0, this.config.scrollSpeed, () => {
        resolve();
      });
    })
  }

  scrollUp(value=1000) {
    const speed = this.config.scrollSpeed;
    return new Promise((resolve, reject) => {
      animatedScrollTo(document.scrollingElement, window.scrollY - value, speed, () => {
        resolve();
      });
    })
  }
}
