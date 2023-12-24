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

import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryGroup,
} from "victory";

const RangeAreaChart = () => {
  // Data for the range area chart
  const data = [
    { x: "2023-01-01", low1: 5, high1: 15, low2: 8, high2: 18 },
    { x: "2023-01-02", low1: 10, high1: 20, low2: 12, high2: 22 },
    { x: "2023-01-03", low1: 15, high1: 25, low2: 17, high2: 27 },
    // Add more data as needed
  ];

  return (
    <VictoryChart
      width={600}
      height={400}
      padding={{ top: 20, bottom: 50, left: 50, right: 50 }}
      domainPadding={{ y: 20 }}
    >
      <VictoryAxis tickFormat={(t) => new Date(t).toLocaleDateString()} />
      <VictoryAxis dependentAxis />
      <VictoryGroup
        labels={({ datum }) => `(${datum.low1}, ${datum.high1})`}
        labelComponent={<VictoryTooltip />}
      >
        <VictoryArea
          data={data}
          x="x"
          y0="low1"
          y="high1"
          style={{
            data: {
              fill: "green",
              fillOpacity: 0.5,
              stroke: "green",
              strokeWidth: 2,
            },
          }}
        />
      </VictoryGroup>
      <VictoryGroup
        labels={({ datum }) => `(${datum.low2}, ${datum.high2})`}
        labelComponent={<VictoryTooltip />}
      >
        <VictoryArea
          data={data}
          x="x"
          y0="low2"
          y="high2"
          style={{
            data: {
              fill: "red",
              fillOpacity: 0.5,
              stroke: "red",
              strokeWidth: 2,
            },
          }}
        />
      </VictoryGroup>
    </VictoryChart>
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
