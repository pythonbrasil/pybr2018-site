import animateScrollTo from 'animated-scroll-to';

const defaultSettings = {
  animationDuration: 233,
};

class Anchors {
  constructor(settings = defaultSettings) {
    this.settings = settings;
    this.onAnchorClick = this.onAnchorClick.bind(this);
    this._getSectionPositionFromAnchor = this._getSectionPositionFromAnchor.bind(this);
    this.ranges = new WeakMap();
    this.anchors = [];
  }

  toggleHighlight(anchor) {
    this.anchors.forEach(anchor => anchor.classList.remove('active'));
    if (anchor && anchor.classList) {
      anchor.classList.add('active');
    }
  }

  onAnchorClick(e) {
    e.preventDefault();
    const anchor = e.currentTarget;
    let targetAnchor = anchor.getAttribute('href');
    // this is needed since the href attr starts with an /
    targetAnchor = targetAnchor.slice(1, targetAnchor.length);
    const elementToScroll = document.querySelector(targetAnchor);
    if (!elementToScroll) {
      return;
    }
    const anchorPosition = elementToScroll.getBoundingClientRect().top;
    const positionToScroll = anchorPosition + (window.scrollY || window.pageYOffset);
    this.toggleHighlight(anchor);
    animateScrollTo(positionToScroll, {
      minDuration: this.settings.animationDuration, maxDuration: this.settings.animationDuration,
      onComplete() {
        anchor.blur();
      }
    });
  }

  _getSectionPositionFromAnchor(anchor) {
    let targetAnchor = anchor.getAttribute('href');
    targetAnchor = targetAnchor.slice(1, targetAnchor.length);
    const elementToScroll = document.querySelector(targetAnchor);
    console.log(targetAnchor);
    this.ranges.set(anchor, elementToScroll.getBoundingClientRect().top);
  }

  setupHighlights() {
    this.ranges = new WeakMap();
  }

  setupScrollAnimation() {
    this.anchors = Array.from(document.querySelectorAll('.scroll'));
    for (const anchor of this.anchors) {
      anchor.addEventListener('click', this.onAnchorClick);
    }
    this.setupHighlights();
  }

  removeScrollAnimation() {
    if (this.anchors && this.anchors.length) {
      for (const anchor of this.anchors) {
        anchor.removeEventListener('click', this.onAnchorClick);
      }
      this.toggleHighlight();
    }
    this.ranges = null;
    this.anchors = null;
  }
}

export default Anchors;