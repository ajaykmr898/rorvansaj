import { useState, useEffect } from "react";
import { Layout } from "components/users";
import { userService, relationsService, alertService } from "services";
import { Spinner } from "../../components";
import MUIDataTable from "mui-datatables";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { RelationsDialog } from "../../components/users/Relations/Relations";
import { RelationsCytoscapeDialog } from "../../components/users/Relations/RelationsCytoscapeDialog";
import { Button, Menu, MenuItem } from "@mui/material";
import { Empty } from "../../components/Empty";
import { FindRelationsDialog } from "../../components/users/Relations/FindRelations";
export default Index;

function Index() {
  const [users, setUsers] = useState(null);
  const [relations, setRelations] = useState(null);
  const [current, setCurrent] = useState(null);
  const [elements, setElements] = useState(null);
  const [index, setIndex] = useState(null);
  const [isRelationsDialogOpen, setRelationsDialogOpen] = useState(false);
  const [isFindRelationsDialogOpen, setIsFindRelationsDialogOpen] =
    useState(false);
  const [isRelationsMapOpen, setRelationsMapOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleClick = (event, dataIndex) => {
    setIndex(dataIndex);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const CustomBodyRender = (dataIndex) => {
    return (
      <>
        <Button
          color="primary"
          variant="outlined"
          onClick={(e) => handleClick(e, dataIndex)}
          startIcon={<MoreVertIcon sx={{ marginLeft: "12px" }} />}
        ></Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              getRelationsByUserId(users[index]);
              handleClose();
            }}
          >
            <InfoIcon sx={{ marginRight: "12px" }} /> Relations
          </MenuItem>
          <MenuItem
            onClick={() => {
              setCurrent(users[index]);
              setRelationsDialogOpen(true);
              handleClose();
            }}
          >
            <MergeIcon sx={{ marginRight: "12px" }} /> Add Relation
          </MenuItem>
          <MenuItem
            onClick={async () => {
              setCurrent(users[index]);
              setIsFindRelationsDialogOpen(true);
              handleClose();
            }}
          >
            <InfoIcon sx={{ marginRight: "12px" }} /> Find Relation
          </MenuItem>
          <MenuItem
            onClick={() => {
              editUser(index);
              handleClose();
            }}
          >
            <EditIcon sx={{ marginRight: "12px" }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              alertService.confirm({
                message:
                  "By this action the user will be deleted with all his relations(only)",
                save: () => {
                  deleteUser(index);
                  handleClose();
                },
              });
            }}
          >
            <DeleteIcon sx={{ marginRight: "12px" }} /> Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const columns = [
    { name: "idd", label: "Id" },
    {
      name: "firstName",
      label: "First Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRenderLite: (dataIndex) => {
          return CustomBodyRender(dataIndex);
        },
      },
    },
  ];

  const closeDialog = () => {
    setRelationsDialogOpen(false);
  };
  const closeFindDialog = () => {
    setIsFindRelationsDialogOpen(false);
  };
  const closeMapDialog = () => {
    setRelationsMapOpen(false);
  };
  const CustomToolbar = ({ displayData }) => {
    return (
      <Button
        startIcon={<AddIcon />}
        color="primary"
        onClick={() => {
          window.location.href = "/users/add";
        }}
      ></Button>
    );
  };

  const options = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: false,
    selectableRowsOnClick: false,
    selectableRows: "none",
    filterType: "dropdown",
    responsive: "standard",
    tableBodyHeight: "",
    tableBodyMaxHeight: "",
    customToolbar: CustomToolbar,
  };

  useEffect(() => {
    userService.getAll().then((x) => {
      x = x.data;
      //x = x.filter((xx) => xx.email !== userService?.userValue?.email);
      x.map((xx, k) => {
        xx.idd = k + 1;
      });
      setUsers([...x]);
      setIsLoading(false);
    });
    relationsService.getAll().then((r) => {
      r = r.data;
      setRelations(r);
    });
  }, []);

  function editUser(id) {
    // search user
    console.log(id);
    let user = users.filter((u, i) => i === id);
    if (user) {
      window.location.href = "/users/edit/" + user[0].id;
    }
  }

  function deleteUser(id) {
    let user = users.filter((u, i) => i === id);
    if (user) {
      id = user[0].id;
      setUsers(
        users.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );
      userService.delete(id).then(() => {
        setUsers((users) => users.filter((x) => x.id !== id));
        // delete relations
        relationsService.deleteByUserId(id).then();
      });
    }
  }

  const getRelationsByUserId = (user) => {
    relationsService.getByUserId(user.id).then((res) => {
      console.log(res);
      res = res.data;

      let elementsT = [
        {
          data: {
            id: "central",
            label: user?.firstName + " " + user?.lastName,
          },
        },
      ];
      res.map((r, i) => {
        let user = r.primary === "relatedUserId" ? r.relatedUserId : r.userId;
        let label =
          r.primary === "relatedUserId"
            ? r.relation?.relation
            : r.relation?.counterRelation;
        elementsT.push(
          {
            data: {
              id: "node" + i,
              rel: r.id,
              label: user?.firstName + " " + user?.lastName,
            },
          },
          {
            data: {
              id: "edge" + i,
              label: label,
              target: "central",
              source: "node" + i,
            },
          }
        );
      });
      setElements(elementsT);
      setRelationsMapOpen(true);
    });
  };

  return (
    <Layout isLoading={isLoading}>
      {isRelationsMapOpen && (
        <RelationsCytoscapeDialog
          elements={elements}
          open={true}
          onClose={closeMapDialog}
        />
      )}
      {isRelationsDialogOpen && (
        <RelationsDialog
          current={current}
          users={users}
          relations={relations}
          open={true}
          onClose={closeDialog}
        />
      )}
      {isFindRelationsDialogOpen && (
        <FindRelationsDialog
          current={current}
          users={users}
          open={true}
          onClose={closeFindDialog}
        />
      )}
      {!users && <Spinner />}
      {users && users.length > 0 && (
        <MUIDataTable
          title="Rors"
          data={users}
          columns={columns}
          options={options}
        />
      )}
      {users && users.length === 0 && <Empty text="No users found" />}
    </Layout>
  );
}
