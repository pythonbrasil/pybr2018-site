export default class LoadingAnimationManager {
  constructor(element, classToToggle) {
    if (!element) {
      throw new Error('LoadingAnimation element not found in DOM');
    }
    this._element = element;
    this._classToToggle = classToToggle;
    this._timeoutId = null;
    this._isTimeoutActive = null;
  }

  toggleDisplay(delay=0) {
    clearTimeout(this._timeoutId);
    if (this._isTimeoutActive) {
      this._isTimeoutActive = false;
      return;
    }
    this._isTimeoutActive = true;
    this._timeoutId = setTimeout(() => {
      this._isTimeoutActive = false;
      this._element.classList.toggle(this._classToToggle);
    }, delay);
  }

  get element() {
    return this._element;
  }

  get classToToggle() {
    return this._classToToggle;
  }
}