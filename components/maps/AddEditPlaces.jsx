import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Place } from "../maps";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

export { AddEditPlaces };
function AddEditPlaces(props) {
  const [locations, setLocations] = useState(props?.locations || []);
  const [addDisabled, setAddDisabled] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [addressToRemove, setAddressToRemove] = useState([]);
  const handleAddressChange = (pos, id) => {
    if (pos && Object.keys(pos).length > 0) {
      setAddDisabled(false);
      setAddresses((prev) => [...prev, pos]);
    }
  };
  const addLocation = () => {
    setAddDisabled(true);
    props?.addLocation(addresses, addressToRemove);
  };

  const removeLocation = (index, type) => {
    console.log(index, type);
    setAddDisabled(false);
    if (type === 1) {
      setAddressToRemove((prev) => [...prev, index]);
      setLocations((el) => el.filter((x, i) => x.id !== index));
    } else {
      setAddresses((el) => el.filter((x, i) => i !== index));
    }
  };
  return (
    <Grid item xs={12} sm={12}>
      Locations:
      <br />
      {locations && locations.length
        ? locations.map((u, i) => (
            <div key={i} onClick={() => removeLocation(u.id, 1)}>
              {u?.location?.formattedAddress}
              <DeleteIcon />
            </div>
          ))
        : "not present"}
      <br />
      <br />
      New Added:
      <br />
      {addresses && addresses.length
        ? addresses.map((u, i) => (
            <div key={i} onClick={() => removeLocation(i, 2)}>
              {u?.formattedAddress}
              <DeleteIcon />
            </div>
          ))
        : "not present"}
      <br />
      <br />
      <Place id="pos" onAddressChange={handleAddressChange} />
      <br />
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => addLocation()}
          variant="contained"
          disabled={addDisabled}
        >
          Save Locations changes
        </Button>
      </Box>
    </Grid>
  );
}
