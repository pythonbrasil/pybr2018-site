import Navigo from 'navigo';

export default class AppRouter {
  constructor(routes, ignoreRecurrentPaths=false) {
    this.isFirstFetch = true;
    this.ignoreRecurrentPaths = ignoreRecurrentPaths;
    this._onNavigation = this._onNavigation.bind(this);
    this._onAnchorClick = this._onAnchorClick.bind(this);
    this._callbackRegistry = [];
    const root = window.location.origin;
    this._router = new Navigo(root, false);
    this._routes = routes;

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
    this.lastPath = path;
    fetch(path)
    .then(response => response.text())
    .then(content => {
      const newPageContent =
        (new DOMParser).parseFromString(content, 'text/html')
        .querySelector('#content');
      const currentPageContent = document.querySelector('#page-content');
      this._cleanupEventListeners();
      currentPageContent.innerHTML = '';
      currentPageContent.appendChild(newPageContent);
      this._setupAnchors();
      window.scrollTo(0, 0);
      this._callbackRegistry.forEach((fn) => {
        fn(path);
      });
    });
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