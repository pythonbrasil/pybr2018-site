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
    this._callbackRegistry = [];
    const root = window.location.origin;
    this._router = new Navigo(root, false);
    this._routes = routes;
    this._transitionManager = new TransitionManager();
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
    this._transitionManager.scrollUp(1000, 466);
    this._transitionManager.fadeContent(currentPageContent, 'fade-out')
    .then(() => fetch(path))
    .then(response => response.text())
    .then(content => {
      this.lastPath = path;
      const newPageContent =
        (new DOMParser).parseFromString(content, 'text/html')
        .querySelector('#content');
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
      window.scrollTo(0, 0);
      this._transitionManager.fadeContent(currentPageContent, 'fade-out');
      this._callbackRegistry.forEach((fn) => {
        fn(path);
      });
    })
    .catch((e) => {
      alert('A problem has happened while loading the new page.');
      this._router.navigate(this.lastPath);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        currentPageContent.classList.remove('fade-out');
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