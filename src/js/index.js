import 'scss/index.scss';
import MobileNavManager from 'app/MobileNavManager';
import AppRouter from 'app/AppRouter';
import 'core-js/fn/object/assign';
import 'core-js/es6/promise';
import 'core-js/es6/symbol';
import 'core-js/es6/string';
import 'isomorphic-fetch';
import 'scrolling-element';
import animateScrollTo from 'animated-scroll-to';
import CodeOfConduct from './codeOfConduct';
const routes = [
  '/codigo-de-conduta',
  '/quero-patrocinar'
];

function onAnchorClick(e) {
  e.preventDefault();
  const anchor = e.currentTarget;
  let targetAnchor = anchor.getAttribute('href');
  // this is needed since the href attr starts with an /
  targetAnchor = targetAnchor.slice(1, targetAnchor.length);
  const elementToScroll = document.querySelector(targetAnchor);
  if (!elementToScroll) {
    return;
  }
  const anchorPosition = elementToScroll.getBoundingClientRect().top;
  const positionToScroll = anchorPosition + (window.scrollY || window.pageYOffset);
  const animationDuration = 233;
  animateScrollTo(positionToScroll, {
    minDuration: animationDuration, maxDuration: animationDuration,
    onComplete() {
      anchor.blur();
    }
  });
}

function setupScrollAnimation() {
  const anchors = document.querySelectorAll('.scroll');
  for (const anchor of anchors) {
    anchor.addEventListener('click', onAnchorClick);
  }
}

function removeScrollAnimation() {
  const anchors = document.querySelectorAll('.scroll');
  for (const anchor of anchors) {
    anchor.removeEventListener('click', onAnchorClick);
  }
}

function onNewContentVisible(path) {
  if (window.location.hash) {
    onAnchorClick({
      preventDefault() {},
      currentTarget: {
        getAttribute() {
          return path + window.location.hash
        },
        blur() {}
      }
    });
  }
}

function init(path) {
  if (path === '/') {
    setupScrollAnimation();
  } else {
    removeScrollAnimation();
  }
  if (path.startsWith('/codigo-de-conduta')) {
    new CodeOfConduct();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  const appRouter = new AppRouter(routes, AppRouter.samePathBehaviours.SCROLL_TOP);
  appRouter.onNewRouteContentReady(init);
  appRouter.onNewRouteContentVisible(onNewContentVisible);
  init(window.location.pathname);
});