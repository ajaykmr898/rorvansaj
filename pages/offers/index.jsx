import { useState, useEffect } from "react";
import { Layout } from "../../components/offers";
import { offersService, alertService } from "services";
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
  const [offers, setOffers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const deleteOffer = (id) => {
    let offer = offers.filter((u, i) => i === id);
    if (offer && offer[0].deleted === "false") {
      id = offer[0].id;
      setOffers(
        offers.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );
      offersService.delete(id).then(() => {
        setOffers((offers) => offers.filter((x) => x.id !== id));
        // delete images
        //offersService.deleteImages(id).then();
      });
    } else {
      alertService.warning("Offer already deleted");
    }
  };

  function editOffer(id) {
    // search offer
    //console.log(id);
    let offer = offers.filter((u, i) => i === id);
    if (offer) {
      window.location.href = "/offers/edit/" + offer[0].id;
    }
  }

  const getByOfferId = (offer) => {
    console.log(offer);
  };

  const CustomBodyRender = (dataIndex) => {
    return (
      <>
        <Tooltip title="View offer info" arrow>
          <span
            onClick={() => {
              getByOfferId(offers[dataIndex]);
            }}
          >
            <InfoIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <span
            onClick={() => {
              editOffer(dataIndex);
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
                  "By this action the offer will be deleted with all its info",
                save: () => {
                  deleteOffer(dataIndex);
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
      name: "type",
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
        //console.log(offersData);
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
      {offers && offers.length > 0 && (
        <MUIDataTable
          title="News / Ads / Offers / Jobs / Agriculture Info"
          data={offers}
          columns={columns}
          options={options}
        />
      )}
      {offers && offers.length === 0 && (
        <MUIDataTable columns={columns} options={options} />
      )}
    </Layout>
  );
}
