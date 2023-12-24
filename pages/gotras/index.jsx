import { useState, useEffect } from "react";
import { Layout } from "../../components/gotras";
import { gotrasService, alertService } from "services";
import MUIDataTable from "mui-datatables";
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@mui/material";

import { Line } from "react-chartjs-2";

const RangeAreaChart = () => {
  // Data for the range area chart
  const data = {
    labels: ["2023-01-01", "2023-01-02", "2023-01-03"],
    datasets: [
      {
        label: "Range1",
        data: [
          { x: "2023-01-01", y: [5, 15] },
          { x: "2023-01-02", y: [10, 20] },
          { x: "2023-01-03", y: [15, 25] },
        ],
        fill: "origin",
        backgroundColor: "rgba(100, 181, 246, 0.5)", // Color for the range between high1 and low1
        borderColor: "rgba(100, 181, 246, 1)", // Border color for the line
      },
      {
        label: "Range2",
        data: [
          { x: "2023-01-01", y: [8, 18] },
          { x: "2023-01-02", y: [12, 22] },
          { x: "2023-01-03", y: [17, 27] },
        ],
        fill: "origin",
        backgroundColor: "rgba(255, 193, 7, 0.5)", // Color for the range between high2 and low2
        borderColor: "rgba(255, 193, 7, 1)", // Border color for the line
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          parser: "YYYY-MM-DD",
          tooltipFormat: "ll",
        },
        ticks: {
          source: "data",
        },
      },
      y: {
        ticks: {
          stepSize: 5, // Adjust the step size based on your Y-axis values
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Index;
function Index() {
  const [gotras, setGotras] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const deleteGotra = (id) => {
    let gotra = gotras.filter((u, i) => i === id);
    if (gotra && gotra[0].deleted === "false") {
      id = gotra[0].id;
      setGotras(
        gotras.map((x) => {
          if (x.id === id) {
            x.isDeleting = true;
          }
          return x;
        })
      );
      gotrasService.delete(id).then(() => {
        setGotras((gotras) => gotras.filter((x) => x.id !== id));
      });
    } else {
      alertService.warning("Gotra already deleted");
    }
  };

  function editGotra(id) {
    // search gotra
    //console.log(id);
    let gotra = gotras.filter((u, i) => i === id);
    if (gotra) {
      window.location.href = "/gotras/edit/" + gotra[0].id;
    }
  }

  const getByGotraId = (gotra) => {
    console.log(gotra);
  };

  const CustomBodyRender = (dataIndex) => {
    return (
      <>
        <Tooltip title="View gotra info" arrow>
          <span
            onClick={() => {
              getByGotraId(gotras[dataIndex]);
            }}
          >
            <InfoIcon sx={{ marginRight: "12px" }} />
          </span>
        </Tooltip>
        <Tooltip title="Edit" arrow>
          <span
            onClick={() => {
              editGotra(dataIndex);
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
                  "By this action the gotra will be deleted with all its info",
                save: () => {
                  deleteGotra(dataIndex);
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
          window.location.href = "/gotras/add";
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
        const response = await gotrasService.getAll();
        const gotrasData = response?.data || [];
        //console.log(gotrasData);
        gotrasData.map((gotra, index) => {
          gotra.idd = index + 1;
          return gotra;
        });
        setGotras([...gotrasData]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGotras([]);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout isLoading={isLoading}>
      {/*gotras && gotras.length > 0 && (
        <MUIDataTable
          title="Gotras"
          data={gotras}
          columns={columns}
          options={options}
        />
      )*/}
      {/*gotras && gotras.length === 0 && (
        <MUIDataTable columns={columns} options={options} />
      )*/}
      <RangeAreaChart />
    </Layout>
  );
}
