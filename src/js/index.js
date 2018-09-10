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
import swURL from 'file-loader?name=sw.js!babel-loader!service-worker';
import KeynotesAccordion from 'app/KeynotesAccordion';
import 'file-loader?name=manifest.json!manifest';
import 'icons/icon48.png';
import 'icons/icon72.png';
import 'icons/icon96.png';
import 'icons/icon144.png';
import 'icons/icon168.png';
import icon192 from 'icons/icon192.png';
import Schedule from 'app/schedule-app';
import 'icons/icon512.png';

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

  if (window.location.hash) {
    const anchorButton = document.createElement('a');
    anchorButton.href = window.location.hash;
    anchorButton.setAttribute('class', 'scroll');
    document.body.appendChild(anchorButton);
    anchors.start();
    anchorButton.click();
    document.body.removeChild(anchorButton);
  }
}

function init(path) {
  if (path.startsWith('/codigo-de-conduta')) {
    new CodeOfConduct();
  }

  if (path.startsWith('/programacao')) {
    new Schedule();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if ('serviceWorker' in navigator) {
    const options = {
      'body': 'Fique ligado nas novidades do evento, direto no seu celular',
      'icon': icon192,
      'vibrate': [200, 100, 200, 100, 200, 100, 400],
    }
    navigator.serviceWorker.register(swURL)
      .then(r => {
        /*if (Notification) {
          Notification.requestPermission().then(permission => {
            if (['denied', 'default'].includes(permission)) {
              return;
            }
            r.showNotification('Python Brasil 14', options);
          });
        }*/
      })
      .catch(r => console.log('worker não foi registrado', r));
  }

  new MobileNavManager();
  const path = window.location.pathname;
  const appRouter = new AppRouter(routes, AppRouter.samePathBehaviours.SCROLL_TOP);
  appRouter.beforeRouteChange(() => anchors.stop());
  appRouter.onNewRouteContentReady(init);
  appRouter.onNewRouteContentVisible(onNewContentVisible);
  init(path);
  anchors.start();
  for (const dropdownContainer of document.querySelectorAll('.mdc-menu-anchor')) {
    new Dropdown(dropdownContainer);
  }
});
