import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { RelationsCytoscape } from "./RelationsCytoscape";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { relationsService } from "../../../services";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { UserInfo } from "../UserInfo";

export { RelationsCytoscapeDialog };
const RelationsCytoscapeDialog = (props) => {
  const current = props?.current;
  const [open, setOpen] = useState(props?.open || false);
  const [toRemove, setToRemove] = useState([]);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setIsError(false);
    setSelectedTab(newValue);
  };

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
        <DialogTitle>Details</DialogTitle>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Info" style={{ width: "50%" }} />
          <Tab label="Relations" style={{ width: "50%" }} />
        </Tabs>
        <DialogContent>
          {selectedTab === 1 && (
            <div>
              <sup className="text-center is-invalid">
                Click on a node to remove a relation
              </sup>
              <RelationsCytoscape remove={remove} elements={props?.elements} />
            </div>
          )}
          {selectedTab === 0 && <UserInfo current={current} />}
        </DialogContent>
        <Typography className="is-invalid text-center">
          {isError ? error : ""}
        </Typography>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {selectedTab === 1 && (
            <Button onClick={handle} color="success">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
