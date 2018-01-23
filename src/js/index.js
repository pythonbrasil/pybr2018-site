import 'scss/index.scss';
import MobileNavManager from 'app/MobileNavManager';
import AppRouter from 'app/AppRouter';
import ScrollTo from 'storm-scroll-to';

document.addEventListener('DOMContentLoaded', () => {
  new MobileNavManager();
  const routes = [
    '/codigo-de-conduta'
  ];
  new AppRouter(routes);
  try {
    ScrollTo.init('.scroll', {
      offset: 120,
      focus: false,
    });
  } catch (e) {

  }
});