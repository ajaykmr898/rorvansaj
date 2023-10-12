import React, { useState } from "react";
import { GoogleMap } from "@react-google-maps/api";

const Map = () => {
  const mapStyles = {
    height: "400px",
    width: "100%",
  };
  const [mapCenter, setMapCenter] = useState({
    lat: 28.6862738,
    lng: 77.2217831,
  });
  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      center={mapCenter}
      zoom={10}
    ></GoogleMap>
  );
};

export default Map;
