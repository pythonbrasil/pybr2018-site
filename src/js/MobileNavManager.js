export default class MobileNavManager {
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
    this.mobileNav.addEventListener('touchend', this.onMobileNavTrigger);
    this.mobileNav.addEventListener('touchmove', this.preventScrolling);
    this.mobileNav.addEventListener('click', this.onMobileNavTrigger);
    this.mobileNav.addEventListener('scroll', this.preventScrolling);
    const menuItems = this.mobileNav.querySelectorAll('.nav__anchor');
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
    const isMenuItem = (e.target.classList.contains('nav__anchor') || e.target.classList.contains('nav__item'));
    const isOpenOrCloseButton = (e.currentTarget === this.mobileNavTrigger || e.currentTarget === this.mobileNavCloseTrigger);
    const isClickOutside = e.currentTarget === this.mobileNav && e.target === this.mobileNav;
    const shouldntClose = (!isMenuItem && !isOpenOrCloseButton && !isClickOutside);
    if (shouldntClose) {
      return;
    }
    if (isMenuItem && e.type === 'click') {
      return;
    }
    this.mobileNav.classList.toggle('opened');
    this.handleFocus();
  }

  get isOpened() {
    return this.mobileNav.classList.contains('opened');
  }
}
