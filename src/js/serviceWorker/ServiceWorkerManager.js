import swURL from "file-loader?name=sw.js!babel-loader!./sw";

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
  }

  start() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swURL)
        .then(registration => this.registration = registration)
        .catch(err => console.error('Service Worker registration failed', err))
    }
  }
}

export default new ServiceWorkerManager();