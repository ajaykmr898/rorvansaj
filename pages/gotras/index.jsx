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

import React from "react";
import { withD3 } from "react-d3-library";
import * as d3 from "d3";

const RangeAreaChart = withD3((props) => {
  const { d3 } = props;

  // Data for the range area chart
  const data = [
    { date: "2023-01-01", low1: 5, high1: 15, low2: 8, high2: 18 },
    { date: "2023-01-02", low1: 10, high1: 20, low2: 12, high2: 22 },
    { date: "2023-01-03", low1: 15, high1: 25, low2: 17, high2: 27 },
    // Add more data as needed
  ];

  // Set up dimensions
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG container
  const svg = d3.select("#d3-container");

  // Create x and y scales
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.date))
    .range([0, width])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.high1)])
    .range([height, 0]);

  // Create area generator functions
  const area1 = d3
    .area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.low1))
    .y1((d) => yScale(d.high1));

  const area2 = d3
    .area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.low2))
    .y1((d) => yScale(d.high2));

  // Append areas to the SVG
  svg.append("path").datum(data).attr("fill", "green").attr("d", area1);

  svg.append("path").datum(data).attr("fill", "red").attr("d", area2);

  // Append axes to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").call(d3.axisLeft(yScale));

  return <div id="d3-container" />;
});

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
