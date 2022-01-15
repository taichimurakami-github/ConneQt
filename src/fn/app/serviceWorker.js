const registerValidSW = (swUrl, config) => {
  navigator.serviceWorker.register(swUrl).then((r) => {
    if (r.wating && config && config.onUpdate) {
      config.onUpdate(r);
    }
    r.onupdatefound = () => {
      const installingWorker = registration.installing;
    };
  });
};
