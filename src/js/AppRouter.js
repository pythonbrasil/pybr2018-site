import Navigo from 'navigo';
import TransitionManager from 'app/TransitionManager';
import animatedScrollTo from 'animated-scrollto';

export default class AppRouter {
  constructor(routes, ignoreRecurrentPaths=false) {
    this.isFirstFetch = true;
    this.lastPath = window.location.pathname;
    this.ignoreRecurrentPaths = ignoreRecurrentPaths;
    this._onNavigation = this._onNavigation.bind(this);
    this._onAnchorClick = this._onAnchorClick.bind(this);
    this._onNewPageContentFetch = this._onNewPageContentFetch.bind(this);
    this._callbackRegistry = [];
    this._router = new Navigo(window.location.origin, false);
    this._routes = routes;
    this._transitionManager = new TransitionManager({
      scrollSpeed: 466,
      fadeSpeed: 233,

    });
    this._setupInternalRoutes();
    this._setupAnchors();
  }

  onNewRouteContentReady(fn) {
    if (typeof fn === 'function') {
      this._callbackRegistry.push(fn);
    }
  }

  _onNavigation() {
    const path = window.location.pathname;
    if (this.isFirstFetch) {
      this.isFirstFetch = false;
      return;
    }
    if (this.ignoreRecurrentPaths && path === this.lastPath) {
      return;
    }
    const currentPageContent = document.querySelector('#page-content');
    this._transitionManager.scrollUp();
    this._transitionManager.showLoadingAnimation();
    Promise.all([
      fetch(path),
      this._transitionManager.fadeContent(currentPageContent, 'fade-out')
    ])
    .then(responses => responses.shift().text())
    .then(this._onNewPageContentFetch)
    .catch((e) => {
      //todo: show decent feedback here
      alert('A problem has happened while loading the new page.');
      this._router.navigate(this.lastPath);
      this._transitionManager.hideLoadingAnimation();
      this._fadePageContentIn(currentPageContent);
    })
  }

  _onNewPageContentFetch(content) {
    const path = window.location.pathname;
    const currentPageContent = document.querySelector('#page-content');
    const newPageContent = (new DOMParser).parseFromString(content, 'text/html')
      .querySelector('#content');
    this.lastPath = path;
    this._transitionManager.hideLoadingAnimation();
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
    this._callbackRegistry.forEach((fn) => {
      fn(path);
    });
    this._fadePageContentIn(currentPageContent);
  }

  _fadePageContentIn(pageContent) {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        this._transitionManager.fadeContent(pageContent, 'fade-out')
      });
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
    e.preventDefault();
    const destinyRoute = e.currentTarget.getAttribute('href');
    this._router.navigate(destinyRoute, true);
  }

  _getInternalAnchors() {
    return document.querySelectorAll('a[href^="/"]');
  }

  _cleanupEventListeners() {
    const anchors = this._getInternalAnchors();
    anchors.forEach((anchor) => {
      anchor.removeEventListener('click', this._onAnchorClick);
    });
  }

  _setupAnchors() {
    const anchors = this._getInternalAnchors();
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', this._onAnchorClick);
    }) 
  }

  _getInternalAnchors() {
    return document.querySelectorAll('a[href^="\/"]');
  }
}
