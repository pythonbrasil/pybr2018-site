import { MDCMenu, Corner } from '@material/menu';

class Dropdown extends MDCMenu {
  constructor(el) {
    super(el.querySelector('.mdc-menu'));
    this._container = el;
    this._trigger = el.querySelector('.nav__anchor');
    this.setAnchorCorner(Corner.BOTTOM_START);
    this._open = this._open.bind(this);
    this._close = this._close.bind(this);
    this._setupTriggers();
  }

  _open(e) {
    this.open = true;
    this._container.addEventListener('mouseleave', this._close);
    this._trigger.removeEventListener('click', this._open);
    this._trigger.removeEventListener('mouseover', this._open);
    this.items.forEach(item => item.parentElement.addEventListener('click', this._close));
  }

  _close(e) {
    this.open = false;
    this._container.removeEventListener('mouseleave', this._close);
    this._trigger.addEventListener('click', this._open);
    this._trigger.addEventListener('mouseover', this._open);
    this.items.forEach(item => item.parentElement.removeEventListener('click', this._close));
  }

  _setupTriggers() {
    this._trigger.addEventListener('click', this._open);
    this._trigger.addEventListener('mouseover', this._open);
  }
}

export default Dropdown;