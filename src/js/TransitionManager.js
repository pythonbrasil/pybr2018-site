import animatedScrollTo from 'animated-scrollto';

export default class TransitionManager {
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
      animatedScrollTo(document.body, 0, 466, () => {
        resolve();
      });
    })
  }

  scrollUp(value=1000, speed=466) {
    return new Promise((resolve, reject) => {
      animatedScrollTo(document.body, window.scrollY - value, speed, () => {
        resolve();
      });
    })
  }
}