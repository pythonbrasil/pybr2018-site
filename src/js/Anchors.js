import animateScrollTo from 'animated-scroll-to';

const defaultSettings = {
  animationDuration: 233,
};

class Anchors {
  constructor(settings = defaultSettings) {
    this.settings = settings;
    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._mapAnchorToSectionPosition = this._mapAnchorToSectionPosition.bind(this);
    this._onUserScroll = this._onUserScroll.bind(this);
    this._targetsPositions = new WeakMap();
    this._highlightableAnchors = [];
    this.anchors = [];
  }

  _isHidden(anchor) {
    const {x, y, width, height} = anchor.getBoundingClientRect();
    return !(x + y + width + height);
  }

  _toggleHighlight(anchor) {
    if (anchor && this._isHidden(anchor)) {
      return;
    }
    this.anchors.forEach(anchor => anchor.classList.remove('active'));
    if (anchor && anchor.classList) {
      anchor.classList.add('active');
    }
  }

  onAnchorClick(e) {
    e.preventDefault();
    const anchor = e.currentTarget;
    // this is needed since the href attr starts with an /
    const targetAnchor = anchor.getAttribute('href').slice(1);
    const elementToScroll = document.querySelector(targetAnchor);
    if (!elementToScroll) {
      return;
    }
    const anchorPosition = elementToScroll.getBoundingClientRect().top;
    const positionToScroll = anchorPosition + (window.scrollY || window.pageYOffset);
    //this._toggleHighlight(anchor);
    animateScrollTo(positionToScroll, {
      minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration,
      onComplete() {
        anchor.blur();
      }
    });
  }

  _mapAnchorToSectionPosition(anchor) {
    // this is needed since the href attr starts with an /
    const targetAnchor = anchor.getAttribute('href').slice(1);
    const elementToScroll = document.querySelector(targetAnchor);
    this._targetsPositions.set(anchor, elementToScroll.getBoundingClientRect().top);
  }

  _onUserScroll() {
    this._highlightableAnchors.forEach(anchor => {
      const anchorTargetPosition = this._targetsPositions.get(anchor);
      if (anchorTargetPosition <= (window.scrollY || window.pageYOffset)) {
        console.log('anchor target position é', anchorTargetPosition, 'scroll é', (window.scrollY || window.pageYOffset));
        this._toggleHighlight(anchor);
      }
    });
  }

  _setupHighlights() {
    this._targetsPositions = new WeakMap();
    this.anchors.forEach(this._mapAnchorToSectionPosition);
    window.addEventListener('scroll', this._onUserScroll, { passive: true });
  }

  setupScrollAnimation() {
    this.anchors = Array.from(document.querySelectorAll('.scroll'));
    this._highlightableAnchors = Array.from(document.querySelectorAll('.nav__items .scroll'));
    this.anchors.forEach(anchor => anchor.addEventListener('click', this.onAnchorClick));
    this._setupHighlights();
  }

  removeScrollAnimation() {
    if (this.anchors && this.anchors.length) {
      this.anchors.forEach(anchor => anchor.removeEventListener('click', this.onAnchorClick));
      this._toggleHighlight();
    }
    window.removeEventListener('scroll', this._onUserScroll, { passive: true });
    this._targetsPositions = null;
    this._highlightableAnchors = null;
    this.anchors = null;
  }
}

export default Anchors;