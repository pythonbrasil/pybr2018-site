import 'scss/index.scss';
import ScrollTo from 'storm-scroll-to';

class MobileNavManager {
  constructor() {
    this.mobileNav = document.querySelector('#mobile-nav');
    this.mobileNavTrigger = document.querySelector('#mobile-nav-trigger');
    this.onMobileNavTrigger = this.onMobileNavTrigger.bind(this);
    this.setupMobileNavigation();
  }

  setupMobileNavigation() {
    this.mobileNavTrigger.addEventListener('click', this.onMobileNavTrigger)
  }

  onMobileNavTrigger(e) {
    if (this.mobileNav.dataset.opened) {
      delete this.mobileNav.dataset.opened;
    } else {
      this.mobileNav.dataset.opened = true;
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  ScrollTo.init('.nav__anchor.scroll');
});