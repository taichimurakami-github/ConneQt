export const setGeolocation = (callback) => {
  const successCallback = (pos) =>
    callback.success({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });

  const errorCallback = (e) => callback.error(e);

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};
