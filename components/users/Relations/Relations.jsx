import React, { useState, useEffect } from "react";
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

export { RelationsDialog };
function RelationsDialog(props) {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const current = props?.current;
  const options = props?.relations.map((r) => ({
    value: r.id,
    label: r.relation,
  }));

  const [open, setOpen] = useState(props?.open || false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [persons, setPersons] = useState([]);

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

  const handleSelectPersonChange = (event, newValue) => {
    setIsError(false);
    setSelectedPerson(newValue);
  };
  const handleSelectRelationChange = (event, newValue) => {
    setIsError(false);
    setSelectedRelation(newValue);
  };
  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };

  const handle = async () => {
    if (!selectedPerson || !selectedRelation) {
      setIsError(true);
      setError("Select both fields to save relation");
      return;
    }
    if (selectedPerson.value === current.id) {
      setIsError(true);
      setError("Person cannot be related to themselves, please change person");
      return;
    }
    let data = {
      relatedUserId: selectedPerson?.value,
      userId: current?.id,
      relation: selectedRelation?.value,
    };
    relationsService
      .create(data)
      .then((res) => {
        handleClose();
      })
      .catch((err) => {
        setIsError(true);
        setError(err);
      });

    //console.log(data, selectedPerson, selectedRelation);
  };

  return (
    <div>
      <Dialog open={open} onClose={props?.onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Relation for
          {` "${current?.firstName} ${current?.lastName}"`}
        </DialogTitle>
        <br />
        <DialogContent>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={persons}
              getOptionLabel={(option) => option.label}
              onInputChange={(event, newValue) => fetchOptionsByName(newValue)}
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
            <br />
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              style={{ width: "90%" }}
              value={selectedRelation}
              onChange={handleSelectRelationChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Relation"
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </DialogContent>
        <Typography className="is-invalid text-center">
          {isError ? error : ""}
        </Typography>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handle} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
