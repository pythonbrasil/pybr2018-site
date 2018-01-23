import 'scss/index.scss';
import MobileNavManager from 'app/MobileNavManager';
import AppRouter from 'app/AppRouter';
import ScrollTo from 'storm-scroll-to';

const scrollToOffset = 128;
const routes = [
  '/codigo-de-conduta'
];

function updateScrollTo(path) {
  if (path === '/') {
    ScrollTo.init('.scroll', {
      offset: 120,
      focus: false,
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  const appRouter = new AppRouter(routes, true);
  appRouter.onNewRouteContentReady(updateScrollTo);
  updateScrollTo(window.location.pathname);
});