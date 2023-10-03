import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default RelationsDialog;
function RelationsDialog(props) {
  const users = props?.users;
  const [open, setOpen] = useState(props?.open || false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props?.onClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={props?.onClose}>
        <DialogTitle>Add Relation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {users.map((u, i) => {
              return <div key={i}>{u.email}</div>;
            })}
          </DialogContentText>
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
}
