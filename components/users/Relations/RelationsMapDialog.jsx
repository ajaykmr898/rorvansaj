import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { RelationsMap } from "./RelationsMap";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export { RelationsMapDialog };
const RelationsMapDialog = (props) => {
  const [open, setOpen] = useState(props?.open || false);
  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Relations</DialogTitle>
        <DialogContent>
          <RelationsMap />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
