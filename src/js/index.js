require('scss/index.scss');

import ScrollTo from 'storm-scroll-to';

const initialize = () => {
  ScrollTo.init('.nav__anchor.scroll', {
    offset: 150,
    focus: false,
  });
}

document.addEventListener('DOMContentLoaded', initialize);