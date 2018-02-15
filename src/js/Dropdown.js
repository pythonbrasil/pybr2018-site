import { MDCMenu, Corner } from '@material/menu';

class Dropdown extends MDCMenu {
  constructor(el) {
    super(el.querySelector('.mdc-menu'));
    this._trigger = el.querySelector('.nav__anchor');
    this.setAnchorCorner(Corner.BOTTOM_END);
    this._setupTrigger();
  }

  _setupTrigger() {
    this._trigger.addEventListener('mouseover', () => this.open = true);
  }
}

export default Dropdown;