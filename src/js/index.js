import 'scss/index.scss';
import ScrollTo from 'storm-scroll-to';

class MobileNavManager {
  constructor() {
    this.mobileNav = document.querySelector('#mobile-nav');
    this.mobileNavTrigger = document.querySelector('#mobile-nav-trigger');
    this.mobileNavCloseTrigger = document.querySelector('#mobile-nav-close-trigger');
    this.preventScrolling = this.preventScrolling.bind(this);
    this.onMobileNavTrigger = this.onMobileNavTrigger.bind(this);
    this.onTouchMoveEnd = this.onTouchMoveEnd.bind(this);
    this.setupMobileNavigation();
  }

  setupMobileNavigation() {
    this.mobileNavTrigger.addEventListener('click', this.onMobileNavTrigger);
    this.mobileNavCloseTrigger.addEventListener('click', this.onMobileNavTrigger);
    this.mobileNav.addEventListener('click', this.onMobileNavTrigger);
    this.mobileNav.addEventListener('touchmove', this.preventScrolling);
    this.mobileNav.addEventListener('scroll', this.preventScrolling);
    const menuItems = this.mobileNav.querySelectorAll('.nav__anchor');
    Array.prototype.forEach.call(menuItems, (menuItem) => {
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('touchend', this.onMobileNavTrigger);
      menuItem.addEventListener('click', this.onMobileNavTrigger);
    });
  }

  preventScrolling(e) {
    e.stopPropagation();
    this.mobileNav.addEventListener('touchend', this.onTouchMoveEnd, true);
  }

  onTouchMoveEnd(e) {
    e.stopPropagation();
    this.mobileNav.removeEventListener('touchend', this.onTouchMoveEnd, true);
  }


  handleFocus() {
    if (this.isOpened) {
      this.mobileNavCloseTrigger.focus();
    } else {
      this.mobileNavTrigger.focus();
    }
  }

  onMobileNavTrigger(e) {
    if (e.currentTarget === this.mobileNav && e.target !== this.mobileNav) {
      return;
    }
    this.mobileNav.classList.toggle('opened');
    this.handleFocus();
    if (e.currentTarget.classList.contains('scroll')) {
      e.preventDefault();
    }
  }

  get isOpened() {
    return this.mobileNav.classList.contains('opened');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  ScrollTo.init('.scroll', {
    offset: 120,
    focus: false,
  });
});