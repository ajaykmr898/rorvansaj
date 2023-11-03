import { useState, useEffect } from "react";
import { Layout } from "../../components/marriage";
import { marriagesService, alertService } from "services";
import MUIDataTable from "mui-datatables";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@mui/material";
export default Index;
function Index() {
  const [marriages, setMarriages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const deleteMarriage = (id) => {
    let marriage = marriages.filter((u, i) => i === id);
    if (marriage && marriage[0].deleted === "false") {
      id = marriage[0].id;
      setMarriages(
        marriages.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );
      marriagesService.delete(id).then(() => {
        setMarriages((marriages) => marriages.filter((x) => x.id !== id));
      });
    } else {
      alertService.warning("Marriage already deleted");
    }
  };

  function editMarriage(id) {
    // search marriage
    //console.log(id);
    let marriage = marriages.filter((u, i) => i === id);
    if (marriage) {
      window.location.href = "/marriage/edit/" + marriage[0].id;
    }
  }

  const CustomBodyRender = (dataIndex) => {
    return (
      <>
        <Tooltip title="View marriagess" arrow>
          <span onClick={() => {}}>
            <InfoIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <span
            onClick={() => {
              editMarriage(dataIndex);
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
                  "By this action the marriage will be deleted with all its info",
                save: () => {
                  deleteMarriage(dataIndex);
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
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "age",
      label: "Age",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "job",
      label: "Job",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "study",
      label: "Study",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "address",
      label: "Address",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "phone",
      label: "Phone",
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
      name: "status",
      label: "Status",
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

  const CustomToolbar = ({ displayData }) => {
    return (
      <Button
        startIcon={<AddIcon />}
        color="primary"
        onClick={() => {
          window.location.href = "/marriage/add";
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
    const fetchData = async () => {
      try {
        const response = await marriagesService.getAll();
        const marriagesData = response?.data || [];
        //console.log(marriagesData);
        marriagesData.map((marriage, index) => {
          marriage.idd = index + 1;
          return marriage;
        });
        setMarriages([...marriagesData]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        //setMarriages([]);
        //setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout isLoading={isLoading}>
      {marriages && marriages.length > 0 && (
        <MUIDataTable
          title="Marriage Requests"
          data={marriages}
          columns={columns}
          options={options}
        />
      )}
      {marriages && marriages.length === 0 && (
        <MUIDataTable columns={columns} options={options} />
      )}
    </Layout>
  );
}
