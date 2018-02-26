import 'scss/index.scss';
import MobileNavManager from 'app/MobileNavManager';
import AppRouter from 'app/AppRouter';
import 'core-js/fn/object/assign';
import 'core-js/fn/array/from';
import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es6/string';
import 'isomorphic-fetch';
import 'scrolling-element';
import CodeOfConduct from './codeOfConduct';
import Dropdown from 'app/Dropdown';
import Anchors from './Anchors';
const routes = [
  '/codigo-de-conduta',
  '/quero-patrocinar',
  '/programacao'
];
const anchors = new Anchors();

function onNewContentVisible(path) {
  if (window.location.hash) {
    const anchor = document.querySelector(`.header__nav a[href="${path + window.location.hash}"]`);
    if (anchor) {
      anchor.click();
    }
  }
}

function init(path) {
  if (path === '/') {
    anchors.setupScrollAnimation();
  }
  if (path.startsWith('/codigo-de-conduta')) {
    new CodeOfConduct();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  const appRouter = new AppRouter(routes, AppRouter.samePathBehaviours.SCROLL_TOP);
  appRouter.beforeRouteChange(() => anchors.removeScrollAnimation());
  appRouter.onNewRouteContentReady(init);
  appRouter.onNewRouteContentVisible(onNewContentVisible);
  init(window.location.pathname);
  for (const dropdownContainer of document.querySelectorAll('.mdc-menu-anchor')) {
    new Dropdown(dropdownContainer);
  }
});