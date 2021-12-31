export const setGeolocation = (locationSetter) => {
  const successCallback = (pos) => {
    locationSetter({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    });
  };

  const errorCallback = () => {
    console.log("failed to fetch geolocation");
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};
