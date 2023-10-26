import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { relationsService, userService } from "../../../services";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Place } from "../../maps";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { RelationsCytoscape } from "./RelationsCytoscape";
import { Spinner } from "../../Spinner";
import LensIcon from "@mui/icons-material/SearchOutlined";

export { FindRelationsDialog };
function FindRelationsDialog(props) {
  const current = props?.current;
  const [persons, setPersons] = useState([]);
  const [map, setMap] = useState(null);
  const [open, setOpen] = useState(props?.open || false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [zoom, setZoom] = useState(2);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [address, setAddress] = useState({});
  const [markers, setMarkers] = useState([]);
  const [circle, setCircle] = useState(null);
  const [elements, setElements] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const circleOptions = {
    strokeColor: "#5AB695",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#5AB695",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 20000, // 20 km in meters
  };
  const [mapCenter, setMapCenter] = useState({
    lat: 28.6862738,
    lng: 77.2217831,
  });
  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const fetchOptionsByName = async (searchTerm) => {
    try {
      searchTerm = searchTerm.trim();
      if (searchTerm && searchTerm.length % 3 === 0) {
        const data = await userService.fetchOptionsByName(searchTerm);
        setPersons(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setIsError(false);
    setSelectedTab(newValue);
  };
  const handleSelectPersonChange = (event, newValue) => {
    setIsError(false);
    setSelectedPerson(newValue);
  };
  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };
  const handleAddressChange = (newAddress, id) => {
    if (newAddress && newAddress?.latitude && newAddress?.longitude) {
      setAddress(newAddress);
      setZoom(10);

      let area = {
        lat: newAddress.latitude,
        lng: newAddress.longitude,
      };
      setMapCenter(area);
      setMarkers((prev) => [area]);

      const newCircle = new window.google.maps.Circle({
        ...circleOptions,
        center: area,
      });
      newCircle.setMap(map);
      setCircle(newCircle);
    }
  };

  const handle = async () => {
    if (selectedTab === 0) {
      if (!selectedPerson) {
        setIsError(true);
        setError("Select person field to find relation");
        return;
      }
      if (selectedPerson.value === current.id) {
        setIsError(true);
        setError(
          "Person cannot be related to themselves, please change person"
        );
        return;
      }
      setElements(null);
      setIsLoading(true);
      let relations = await relationsService.findRelationships(
        current?.id,
        selectedPerson?.value,
        selectedPerson?.label
      );

      let relationFound = "No relationships found.";
      //console.log(relations);
      if (relations.length > 0) {
        relationFound = `Deep relationships found.`;
      }

      setIsError(true);
      setError(relationFound);
      setElements(relations);
      setIsLoading(false);
    } else {
      setUsers(null);
      let res = await relationsService.findRelationshipsAddress(address);
      setUsers(res.data);
    }
  };

  const initMap = (maps) => {
    setMap(maps);
    /*setMarkers([
      { lat: 29.8853701, lng: 76.62105389999999 },
      { lat: 29.9806941, lng: 76.5846091 },
    ]);
    setCircle({
      mapCenter: { lat: 29.8853701, lng: 76.62105389999999 },
    });*/
  };

  return (
    <div>
      <Dialog open={open} onClose={props?.onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Find Relations for {`"${current?.firstName} ${current?.lastName}"`}
        </DialogTitle>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="By Person" style={{ width: "50%" }} />
          <Tab label="By Place" style={{ width: "50%" }} />
        </Tabs>
        <br />
        <DialogContent>
          {selectedTab === 0 && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={persons}
                getOptionLabel={(option) => option.label}
                onInputChange={(event, newValue) =>
                  fetchOptionsByName(newValue)
                }
                style={{ width: "90%" }}
                value={selectedPerson}
                onChange={handleSelectPersonChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Person"
                    variant="outlined"
                  />
                )}
              />
              {isLoading ? (
                <Spinner />
              ) : (
                elements &&
                elements.length > 0 && (
                  <RelationsCytoscape elements={elements} />
                )
              )}
            </Grid>
          )}
          {selectedTab === 1 && (
            <Grid item xs={12} sm={6}>
              <Place
                isRequired={true}
                id="pos"
                placeholder="Find Place"
                onAddressChange={handleAddressChange}
              />
              <br />
              <GoogleMap
                mapContainerStyle={mapStyles}
                center={mapCenter}
                zoom={zoom}
                onLoad={(map) => {
                  initMap(map);
                }}
              >
                {markers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={{ lat: marker?.lat, lng: marker?.lng }}
                  />
                ))}
                {!!circle && (
                  <Circle
                    center={mapCenter}
                    options={circleOptions}
                    radius={circleOptions?.radius}
                  />
                )}
              </GoogleMap>
              {!users && <Spinner />}
              {users && users.length
                ? users.map((u, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedPerson({
                          value: u.id,
                          label: `${u?.firstName} ${u?.lastName} - ${u?.phone} - ${u?.email}`,
                        });
                        setElements(null);
                        setSelectedTab(0);
                      }}
                    >
                      {u.firstName} {u.lastName} - ${u?.phone} - ${u.email}
                      <LensIcon />
                    </div>
                  ))
                : "no relations found"}
            </Grid>
          )}
        </DialogContent>
        <Typography className="is-invalid text-center">
          {isError ? error : ""}
        </Typography>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handle} color="primary">
            Find
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
