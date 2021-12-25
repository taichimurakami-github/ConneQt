import { Header } from "../UI/Header";
import { useState } from "react";
import { cmpConfig } from "./config";

export const EditLocation = (props) => {
  const [locationState, setLocationState] = useState({
    lat: 0,
    lng: 0,
  });

  const getGeolocation = () => {
    const successCallback = (pos) => {
      setLocationState({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    };

    const errorCallback = () => {
      console.log("failed to fetch geolocation");
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  const handleUpdateLocation = () => {
    if (
      locationState.lat === props.nowLocation.lat &&
      locationState.lng === props.nowLocation.lng
    ) {
      console.log("LOCATION HAS NOT BEEN CHANGED.");
      return;
    }

    props.handleSubmit({
      lat: locationState.lat,
      lng: locationState.lng,
    });
  };

  return (
    <>
      <Header
        title="位置情報を編集"
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />
      {/* <iframe
        width="600"
        height="450"
        style="border:0"
        loading="lazy"
        allowfullscreen
        src={`https://maps.google.com/maps?output=embed&ll=${locationState.lat},${locationState.lng}&t=m&hl=ja`} */}
      {/* ></iframe> */}
      {/* <iframe
        width="600"
        height="400"
        style="border: 0"
        loading="lazy"
        src={`https://maps.google.com/maps/@${locationState.lat},${locationState.lng}`}
      ></iframe> */}
      <p>
        アカウントの位置情報： (lat, lng) = (
        {props.nowLocation.lat + ", " + props.nowLocation.lng})
      </p>
      <p>
        取得した位置情報： (lat, lng) = (
        {locationState.lat + ", " + locationState.lng})
      </p>

      <button className="btn-gray" onClick={getGeolocation}>
        現在の位置情報を取得
      </button>
      <button className="btn-orange" onClick={handleUpdateLocation}>
        この位置情報を登録する
      </button>
    </>
  );
};
