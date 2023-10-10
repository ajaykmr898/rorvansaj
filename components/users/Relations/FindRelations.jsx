import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { relationsService } from "../../../services";
import Typography from "@mui/material/Typography";

export { FindRelationsDialog };
function FindRelationsDialog(props) {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const current = props?.current;
  const users = props?.users;
  const persons = users.map((u, i) => {
    return {
      value: u.id,
      label: `${u?.firstName} ${u?.lastName}`,
    };
  });
  const [open, setOpen] = useState(props?.open || false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const handleSelectPersonChange = (event, newValue) => {
    setIsError(false);
    setSelectedPerson(newValue);
  };
  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };

  const handle = async () => {
    if (!selectedPerson) {
      setIsError(true);
      setError("Select person field to find relation");
      return;
    }
    if (selectedPerson.value === current.id) {
      setIsError(true);
      setError("Person cannot be related to themselves, please change person");
      return;
    }
    let relationFound = await relationsService.findRelations(
      current?.id,
      selectedPerson?.value
    );
    setIsError(true);
    setError(relationFound);
    //console.log(data, selectedPerson, selectedRelation);
  };

  return (
    <div>
      <Dialog open={open} onClose={props?.onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          Find Relation for
          {` "${current?.firstName} ${current?.lastName}"`}
        </DialogTitle>
        <br />
        <DialogContent>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={persons}
              getOptionLabel={(option) => option.label}
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
          </Grid>
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
