import Navigo from 'navigo';
import TransitionManager from 'app/TransitionManager';
import { FetchAborttedError } from 'app/errors';
import { MDCSnackbar } from '@material/snackbar';

export default class AppRouter {
  static get samePathBehaviours() {
    return {
      SCROLL_TOP: 'scrollTop',
      DEFAULT: 'default'
    }
  }

  constructor(routes, samePathBehaviour=AppRouter.samePathBehaviours.DEFAULT) {
    this.isFirstFetch = true;
    this.lastPath = window.location.pathname;
    this.samePathBehaviour = samePathBehaviour;
    this._onNavigation = this._onNavigation.bind(this);
    this._onAnchorClick = this._onAnchorClick.bind(this);
    this._onNewPageContentFetch = this._onNewPageContentFetch.bind(this);
    this._contentReadyCallbackRegistry = [];
    this._contentVisibleCallbackRegistry = [];
    this._beforeRouteChangeCallbackRegistry = [];
    this._router = new Navigo(window.location.origin, false);
    this._routes = routes;
    this._transitionManager = new TransitionManager({
      scrollSpeed: 466,
      fadeSpeed: 233,
    });
    this._setupInternalRoutes();
    this._setupAnchors();
    this._snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
  }

  beforeRouteChange(fn) {
    if (typeof fn === 'function') {
      this._beforeRouteChangeCallbackRegistry.push(fn);
    }
  }

  onNewRouteContentReady(fn) {
    if (typeof fn === 'function') {
      this._contentReadyCallbackRegistry.push(fn);
    }
  }
  onNewRouteContentVisible(fn) {
    if (typeof fn === 'function') {
      this._contentVisibleCallbackRegistry.push(fn);
    }
  }

  _onNavigation() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const isSamePageHashRoute = hash === '#' || (hash && path === this.lastPath);
    const isSamePage = this.lastPath === path;
    this._nextValidPath = path;
    if (this.isFirstFetch || isSamePageHashRoute || isSamePage) {
      this.isFirstFetch = false;
      return;
    }

    this._beforeRouteChangeCallbackRegistry.forEach((fn) => {
      fn(path);
    });
    const currentPageContent = document.querySelector('#page-content');
    this._transitionManager.showLoadingAnimation();
    fetch(path)
    .then(response => {
      const shouldAbort = !response.url.includes(this._nextValidPath) && response.url;
      if (shouldAbort) {
        throw new FetchAborttedError('Fetch Abortted');
      }
      return response.text();
    })
    .then(this._onNewPageContentFetch)
    .catch((e) => {
      if (e.message === 'Fetch Abortted') {
        return;
      }
      this._router.navigate(this.lastPath);
      this._transitionManager.hideLoadingAnimation(false);
      const dataObj = {
        message: 'Não foi possível carregar a página. Verifique sua conexão com a Internet.',
        timeout: 5000,
        actionText: 'Ok',
        actionHandler() {
          this._snackbar.hide();
        }
      };
      this._snackbar.show(dataObj);
    })
  }

  _onNewPageContentFetch(content) {
    const path = window.location.pathname;
    const currentPageContent = document.querySelector('#page-content');
    const newPageContent = (new DOMParser).parseFromString(content, 'text/html')
      .querySelector('#content');
    this.lastPath = path;
    this._transitionManager.hideLoadingAnimation();
    this._transitionManager.fadeContent(currentPageContent, 'fade-out')
    .then(() => {
      if (!currentPageContent) {
        throw new Error('current page must have a #page-content element');
      }
      if (!newPageContent) {
        throw new Error('new page must have a #content element');
      }
      this._cleanupEventListeners();
      currentPageContent.innerHTML = '';
      currentPageContent.appendChild(newPageContent);
      this._setupAnchors();
      this._contentReadyCallbackRegistry.forEach((fn) => {
        fn(path);
      });
      return this._fadePageContentIn(currentPageContent);
    })
    .then(() => {
      this._contentVisibleCallbackRegistry.forEach((fn) => {
        fn(path);
      });
    })
  }

  _fadePageContentIn(pageContent, scroll=true) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        if (scroll) {
          window.scrollTo(0, 0);
        }
        requestAnimationFrame(() => {
          this._transitionManager.fadeContent(pageContent, 'fade-out')
          .then(resolve);
        });
      })
    })
  }

  _setupInternalRoutes() {
    const routesHandlers = {};
    this._routes.forEach((route) => {
      routesHandlers[route] = this._onNavigation;
    });

    this._router.on(this._onNavigation).resolve();
    this._router.on(routesHandlers).resolve();
  }

  _onAnchorClick(e) {
    const destinyRoute = e.currentTarget.getAttribute('href');
    const isInvalidRoute = destinyRoute !== '/' && !this._routes.includes(destinyRoute) && !destinyRoute.includes('#');

    if (isInvalidRoute) {
      return;
    }
    e.preventDefault();
    for (const anchor of this._getInternalAnchors()) {
      anchor.classList.remove('active');
    }
    e.currentTarget.classList.add('active');
    if (this.lastPath === destinyRoute) {
      switch (this.samePathBehaviour) {
        case AppRouter.samePathBehaviours.SCROLL_TOP:
          this._transitionManager.scrollTop();
          break;
        default:
          break;
      }
    }
    this._router.navigate(destinyRoute, true);
  }

  _getInternalAnchors() {
    return document.querySelectorAll('a[href^="/"]');
  }

  _cleanupEventListeners() {
    const anchors = this._getInternalAnchors();
    for (let anchor of anchors) {
      anchor.removeEventListener('click', this._onAnchorClick);
    }
  }

  _setupAnchors() {
    const anchors = this._getInternalAnchors();
    for (let anchor of anchors) {
      anchor.addEventListener('click', this._onAnchorClick);
    }
  }

  _getInternalAnchors() {
    return document.querySelectorAll('a[href^="\/"]');
  }
}
