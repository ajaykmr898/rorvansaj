import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { RelationsCytoscape } from "./RelationsCytoscape";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { relationsService } from "../../../services";
import Typography from "@mui/material/Typography";

export { RelationsCytoscapeDialog };
const RelationsCytoscapeDialog = (props) => {
  const [open, setOpen] = useState(props?.open || false);
  const [toRemove, setToRemove] = useState([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };

  const handle = () => {
    //console.log(toRemove);
    toRemove.map((id) => {
      relationsService
        .delete(id)
        .then(() => {
          handleClose();
        })
        .catch(() => {
          setIsError(true);
          setError("Error while removing relation, retry");
        });
    });
  };

  const remove = (id) => {
    setToRemove((p) => [...p, id]);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Relations</DialogTitle>
        <sup className="text-center">Click on a node to remove relation </sup>
        <DialogContent>
          <RelationsCytoscape remove={remove} elements={props?.elements} />
        </DialogContent>
        <Typography className="is-invalid text-center">
          {isError ? error : ""}
        </Typography>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handle} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
