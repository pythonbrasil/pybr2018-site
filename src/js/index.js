import 'scss/index.scss';
import ScrollTo from 'storm-scroll-to';

class MobileNavManager {
  constructor() {
    this.mobileNav = document.querySelector('#mobile-nav');
    this.mobileNavTrigger = document.querySelector('#mobile-nav-trigger');
    this.mobileNavCloseTrigger = document.querySelector('#mobile-nav-close-trigger');
    this.onMobileNavTrigger = this.onMobileNavTrigger.bind(this);
    this.setupMobileNavigation();
  }

  setupMobileNavigation() {
    this.mobileNavTrigger.addEventListener('click', this.onMobileNavTrigger);
    this.mobileNavCloseTrigger.addEventListener('click', this.onMobileNavTrigger);

    const menuItems = this.mobileNav.querySelectorAll('.nav__anchor');
    Array.prototype.forEach.call(menuItems, (menuItem) => {
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('touchend', this.onMobileNavTrigger);
      menuItem.addEventListener('click', this.onMobileNavTrigger);
    });
  }

  onMobileNavTrigger(e) {
    this.mobileNav.classList.toggle('opened');
    if (e.type == 'touchend') {
      e.stopPropagation();
      e.preventDefault();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  ScrollTo.init('.nav__anchor.scroll', {
    offset: 120,
    focus: false,
  });
});