import animatedScrollTo from 'animated-scrollto';
import LoadingAnimationManager from 'app/LoadingAnimationManager';

const defaultConfig = {
  scrollSpeed: 466,
  fadeSpeed: 233,
  loadingAnimation: {
    showDelay: 300,
    elementId: '#loading-circle',
    classToToggle: 'fade-out'
  }
}

export default class TransitionManager {

  constructor(config = defaultConfig) {
    this.config = { ...config, ...defaultConfig };
    this._loadingAnimation = new LoadingAnimationManager(
      document.querySelector(this.config.loadingAnimation.elementId),
      this.config.loadingAnimation.classToToggle
    );
  }

  showLoadingAnimation() {
    this._loadingAnimation.toggleDisplay(this.config.loadingAnimation.showDelay);
  }

  hideLoadingAnimation() {
    this._loadingAnimation.toggleDisplay();
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
      animatedScrollTo(document.body, 0, this.config.scrollSpeed, () => {
        resolve();
      });
    })
  }

  scrollUp(value=1000) {
    const speed = this.config.scrollSpeed;
    return new Promise((resolve, reject) => {
      animatedScrollTo(document.body, window.scrollY - value, speed, () => {
        resolve();
      });
    })
  }



}