import { useState, useEffect } from "react";
import { Layout } from "../../components/offers";
import { offersService, alertService } from "services";
import { Spinner } from "../../components";
import MUIDataTable from "mui-datatables";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@mui/material";
import { Empty } from "../../components/Empty";
export default Index;

function Index() {
  const [offers, setOffers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const CustomBodyRender = (dataIndex) => {
    return (
      <>
        <Tooltip title="View Relations" arrow>
          <span onClick={() => {}}>
            <InfoIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <span onClick={() => {}}>
            <EditIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <span
            onClick={() => {
              alertService.confirm({
                message:
                  "By this action the offer will be deleted with all his relations(only)",
                save: () => {},
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
      name: "title",
      label: "Title",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "user",
      label: "User",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "types",
      label: "Type",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "from",
      label: "From",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "to",
      label: "To",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "charge",
      label: "Charge",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "visibility",
      label: "Visibility",
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
          window.location.href = "/offers/add";
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
        const response = await offersService.getAll();
        const offersData = response.data;
        console.log(offersData);
        offersData.map((offer, index) => {
          offer.idd = index + 1;
          return offer;
        });
        setOffers([...offersData]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout isLoading={isLoading}>
      {!offers && <Spinner />}
      {offers && offers.length > 0 && (
        <MUIDataTable
          title="Offers"
          data={offers}
          columns={columns}
          options={options}
        />
      )}
      {offers && offers.length === 0 && <Empty text="No offers found" />}
    </Layout>
  );
}
