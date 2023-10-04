import { useState, useEffect } from "react";
import { Layout, RelationsMapDialog, RelationsDialog } from "components/users";
import { userService } from "services";
import { Spinner } from "../../components";
import MUIDataTable from "mui-datatables";
import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import InfoIcon from "@mui/icons-material/Info";

export default Index;

function Index() {
  const [users, setUsers] = useState(null);
  const [current, setCurrent] = useState(null);
  const [isRelationsDialogOpen, setRelationsDialogOpen] = useState(false);
  const [isRelationsMapOpen, setRelationsMapOpen] = useState(false);
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
          return (
            <>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  setCurrent(users[dataIndex]);
                  setRelationsMapOpen(true);
                }}
                startIcon={<InfoIcon sx={{ marginLeft: "12px" }} />}
              ></Button>
              &nbsp;
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => {
                  setCurrent(users[dataIndex]);
                  setRelationsDialogOpen(true);
                }}
                startIcon={<MergeIcon sx={{ marginLeft: "12px" }} />}
              ></Button>
              &nbsp;
              <Button
                variant="outlined"
                onClick={() => {
                  editUser(dataIndex);
                }}
                startIcon={<EditIcon sx={{ marginLeft: "12px" }} />}
              ></Button>
              &nbsp;
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  deleteUser(dataIndex);
                }}
                startIcon={<DeleteIcon sx={{ marginLeft: "12px" }} />}
              ></Button>
            </>
          );
        },
      },
    },
  ];

  const closeDialog = () => {
    setRelationsDialogOpen(false);
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
          window.open("/users/add", "_blank");
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
      //x = x.filter((xx) => xx.email !== userService?.userValue?.email);
      x.map((xx, k) => {
        xx.idd = k + 1;
      });
      setUsers([...x]);
    });
  }, []);

  function editUser(id) {
    // search user
    console.log(id);
    let user = users.filter((u, i) => i === id);
    if (user) {
      window.open("/users/edit/" + user[0].id, "_blank");
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
      });
    }
  }

  return (
    <Layout>
      {isRelationsMapOpen && (
        <RelationsMapDialog open={true} onClose={closeMapDialog} />
      )}
      {isRelationsDialogOpen && (
        <RelationsDialog
          current={current}
          users={users}
          open={true}
          onClose={closeDialog}
        />
      )}
      {!users && <Spinner />}
      {users && users.length > 0 && (
        <MUIDataTable
          title="Users"
          data={users}
          columns={columns}
          options={options}
        />
      )}
    </Layout>
  );
}
