import Navigo from 'navigo';

export default class AppRouter {
  constructor(routes) {
    this.onNavigation = this.onNavigation.bind(this);
    this.onAnchorClick = this.onAnchorClick.bind(this);

    const root = null;
    this._router = new Navigo(root, false);
    this._routes = routes;

    this.setupInternalRoutes();
    this.setupAnchors();
  }

  setupRootRoute() {
    this._router.on(() => {
      console.log('going to default route');
    }).resolve();
  }

  onNavigation() {
    const path = window.location.pathname;
    fetch(path)
    .then(response => response.text())
    .then(content => {
      const newPageContent =
        (new DOMParser).parseFromString(content, 'text/html')
        .querySelector('#content');
      const currentPageContent = document.querySelector('#page-content');
      currentPageContent.innerHTML = '';
      newPageContent.childNodes.forEach((node) => {
        currentPageContent.appendChild(node);
      });
    });
  }

  setupInternalRoutes() {

    const routesHandlers = {};
    this._routes.forEach((route) => {
      routesHandlers[route] = this.onNavigation;
    });

    this._router.on(routesHandlers).resolve();
  }

  onAnchorClick(e) {
    e.preventDefault();
    const destinyRoute = e.currentTarget.getAttribute('href');
    this._router.navigate(destinyRoute, true);
  }

  getInternalAnchors() {
    return document.querySelectorAll('a[href^="/"]');
  }

  cleanupEventListeners() {
    const anchors = this.getInternalAnchors();
    anchors.forEach((anchor) => {
      anchor.removeEventListener('click', this.onAnchorClick);
    });
  }

  setupAnchors() {
    const anchors = this.getInternalAnchors();
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', this.onAnchorClick);
    }) 
  }

  getInternalAnchors() {
    return document.querySelectorAll('a[href^="\/"]');
  }
}