import { useState, useEffect } from "react";
import { Layout } from "components/users";
import {
  userService,
  relationsService,
  alertService,
  offersService,
  locationsService,
} from "services";
import MUIDataTable from "mui-datatables";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import LensIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import MergeIcon from "@mui/icons-material/MergeOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { RelationsDialog } from "../../components/users/Relations/Relations";
import { RelationsCytoscapeDialog } from "../../components/users/Relations/RelationsCytoscapeDialog";
import { Button, Menu, MenuItem, TablePagination } from "@mui/material";
import { FindRelationsDialog } from "../../components/users/Relations/FindRelations";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Filters } from "../../components/users/Filters";
export default Index;

function Index() {
  const [users, setUsers] = useState(null);
  const [relations, setRelations] = useState(null);
  const [current, setCurrent] = useState(null);
  const [elements, setElements] = useState(null);
  const [isRelationsDialogOpen, setRelationsDialogOpen] = useState(false);
  const [isFindRelationsDialogOpen, setIsFindRelationsDialogOpen] =
    useState(false);
  const [isRelationsMapOpen, setRelationsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState(null);

  const CustomBodyRender = (dataIndex) => {
    //console.log("q", dataIndex);
    return (
      <>
        <Tooltip title="View user info" arrow>
          <span
            onClick={() => {
              setCurrent(users[dataIndex]);
              getRelationsByUserId(users[dataIndex]);
            }}
          >
            <InfoIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Add Relations" arrow>
          <span
            onClick={() => {
              setCurrent(users[dataIndex]);
              setRelationsDialogOpen(true);
            }}
          >
            <MergeIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Find Relations" arrow>
          <span
            onClick={async () => {
              setCurrent(users[dataIndex]);
              setIsFindRelationsDialogOpen(true);
            }}
          >
            <LensIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <span
            onClick={() => {
              editUser(dataIndex);
            }}
          >
            <EditIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <span
            onClick={() => {
              alertService.confirm({
                message:
                  "By this action the user will be deleted with all his relations(only)",
                save: () => {
                  deleteUser(dataIndex);
                },
              });
            }}
          >
            <DeleteIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
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

  const CustomFooter = () => {
    return (
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={count}
        rowsPerPage={pagination.pageSize}
        page={pagination.page - 1}
        ActionsComponent={(props) => (
          <>
            <Button
              disabled={pagination.page === 1}
              startIcon={<NavigateBeforeIcon />}
              color="secondary"
              sx={{ marginRight: "12px" }}
              onClick={() => {
                //console.log(props);
                onPageChange(pagination.page - 1);
              }}
            ></Button>
            <Button
              disabled={
                pagination.page - 1 >=
                Math.ceil(count / pagination.pageSize) - 1
              }
              startIcon={<NavigateNextIcon />}
              color="secondary"
              sx={{ marginRight: "12px" }}
              onClick={() => {
                onPageChange(pagination.page + 1);
              }}
            ></Button>
          </>
        )}
        onPageChange={() => {}}
      />
    );
  };

  const onPageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const options = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    pagination: true,
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
    customFooter: CustomFooter,
    rowsPerPage: pagination.pageSize,
  };

  const fetchData = async (filtersT = null) => {
    try {
      let filtersTemp = {};
      let paginationT = { ...pagination };
      if (filtersT) {
        paginationT = { ...paginationT, page: 1 };
        if (filtersT?.name && filtersT?.name.trim()) {
          filtersTemp = { ...filtersTemp, name: filtersT.name.trim() };
        }
        if (filtersT?.dob && filtersT?.dob.trim()) {
          filtersTemp = { ...filtersTemp, dob: filtersT.dob.trim() };
        }
        if (filtersT?.gender && filtersT?.gender.trim()) {
          filtersTemp = { ...filtersTemp, gender: filtersT.gender.trim() };
        }
        if (filtersT?.pos && Object.keys(filtersT.pos).length) {
          filtersTemp = { ...filtersTemp, pos: filtersT.pos };
        }
      }

      const filtersTemp2 = { ...paginationT, ...filtersTemp };
      //console.log(filtersTemp2);
      //return false;
      const response = await userService.getAll(filtersTemp2);
      const data = response.data;
      setCount(data?.totalCount);
      const usersData = data?.users;
      usersData.map((user, index) => {
        user.idd = index + 1;
        return user;
      });
      setUsers([...usersData]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    relationsService.getAll().then((r) => {
      r = r.data;
      setRelations(r);
    });
  }, []);

  const search = async (filterT) => {
    setFilters(filterT);
    await fetchData(filterT);
  };

  function editUser(id) {
    // search user
    //console.log(id);
    let user = users.filter((u, i) => i === id);
    if (user) {
      window.location.href = "/users/edit/" + user[0].id;
    }
  }

  function deleteUser(id) {
    let user = users.filter((u, i) => i === id);
    if (user && user[0].deleted === "false") {
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
    } else {
      alertService.warning("User already deleted");
    }
  }

  const getRelationsByUserId = (user) => {
    relationsService.getByUserId(user.id).then((res) => {
      //console.log(res);
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
      <Filters search={search} />
      <br />
      {isRelationsMapOpen && (
        <RelationsCytoscapeDialog
          current={current}
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
      {users && users.length > 0 && (
        <>
          <MUIDataTable
            title="Rors"
            data={users}
            columns={columns}
            options={options}
          />
        </>
      )}
      {users && users.length === 0 && (
        <>
          <MUIDataTable columns={columns} options={options} />
        </>
      )}
    </Layout>
  );
}
