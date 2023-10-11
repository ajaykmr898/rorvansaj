import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const MapDialog = ({ open, onClose, markers, center }) => {
  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <LoadScript
          googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
          libraries={["places"]}
        >
          <GoogleMap mapContainerStyle={mapStyles} center={center} zoom={10}>
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
