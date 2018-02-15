import { MDCMenu, Corner } from '@material/menu';

class Dropdown extends MDCMenu {
  constructor(el) {
    super(el.querySelector('.mdc-menu'));
    this._trigger = el.querySelector('.nav__anchor');
    this.setAnchorCorner(Corner.BOTTOM_START);
    this._setupTriggers();
  }

  _setupTriggers() {
    const toggleOpen = () => this.open = !this.open;
    this._trigger.addEventListener('click', toggleOpen);
    for (const child of this.items) {
      child.parentElement.addEventListener('click', toggleOpen);
    }
  }
}

export default Dropdown;