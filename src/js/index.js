import 'scss/index.scss';
import 'core-js/fn/object/assign';
import 'core-js/fn/object/values';
import 'core-js/fn/array/from';
import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es6/string';
import 'isomorphic-fetch';
import 'scrolling-element';
import MobileNavManager from 'app/MobileNavManager';
import AppRouter from 'app/AppRouter';
import CodeOfConduct from 'app/CodeOfConduct';
import Dropdown from 'app/Dropdown';
import ScrollNavigation from 'scroll-navigation-menu';
const routes = [
  '/codigo-de-conduta',
  '/quero-patrocinar',
  '/programacao',
  '/patrocinadores',
  '/evento'
];
const anchors = new ScrollNavigation({
  offset: -100
});

function onNewContentVisible(path) {
  if (path === '/') {
    anchors.start();
  }
  if (window.location.hash) {
    const anchor = document.querySelector(`.header__nav a[href="${path + window.location.hash}"]`);
    if (anchor) {
      anchor.click();
    }
  }
}

function init(path) {
  if (path.startsWith('/codigo-de-conduta')) {
    new CodeOfConduct();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  const path = window.location.pathname;
  const appRouter = new AppRouter(routes, AppRouter.samePathBehaviours.SCROLL_TOP);
  appRouter.beforeRouteChange(() => anchors.stop());
  appRouter.onNewRouteContentReady(init);
  if (path === '/') {
    anchors.start();
  }
  appRouter.onNewRouteContentVisible(onNewContentVisible);
  init(path);
  if (path === '/') {
    anchors.start();
  }
  for (const dropdownContainer of document.querySelectorAll('.mdc-menu-anchor')) {
    new Dropdown(dropdownContainer);
  }
});
