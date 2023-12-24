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

import { useRef } from 'react';
import Chart from 'chart.js';

const RangeAreaChart = () => {
  const dataRef = useRef([]);
  const [data, setData] = useState([]);

  const handleChange = (newData) => {
    setData(newData);
    dataRef.current = newData;
  };

  const renderChart = () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Range Area',
          data: dataRef.current.map((date) => [
            date.x,
            date.low1,
            date.high1,
          ]),
          fill: false,
          borderColor: '#ffff00',
          borderWidth: 2,
        }],
        xAxis: {
          type: 'date',
          categories: dataRef.current.map((date) => date.x),
        },
        yAxes: [
          { id: 'low1', title: 'Low 1', min: 0 },
          { id: 'high1', title: 'High 1', min: 0 },
        ],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            type: 'time',
            tooltip: true,
            time: { parser: 'iso8601' },
          }],
          yAxes: [
            { id: 'low1', ticks: { beginAtZero: true } },
            { id: 'high1', ticks: { beginAtZero: true } },
          ],
        },
      },
      plugins: ['afterDatasetsDraw'],
    });

    chart.options.afterDatasetsDraw = (chart) => {
      const ctx = chart.ctx;
      const rangeArea = Object.assign(chart.data.datasets[0], {
        type: 'area',
        borderWidth: 0,
        fill: '#ffff00',
      });

      const rangePoints = [];
      dataRef.current.forEach((date) => {
        const range = date.high1 - date.low1;
        rangePoints.push({ x: date.x, y: date.low1 + range / 2 });
      });

      const rangeAreaPath = ctx.createArea();
      rangeAreaPath.moveTo(rangePoints[0].x, rangePoints[0].y);
      for (let i = 1; i < rangePoints.length; i++) {
        const dataPoint = rangePoints[i];
        rangeAreaPath.lineTo(dataPoint.x, dataPoint.y);
      }
      rangeAreaPath.fill();
      ctx.fillStyle = '#ffff00';
      ctx.fill();
    };
  };

  return (
    <div>
      <canvas id="myChart"></canvas>
      <button onClick={() => handleChange([
        { x: new Date('2023-01-01'), low1: 100, high1: 150, low2: 80, high2: 120 },
        { x: new Date('2023-01-02'), low1: 110, high1: 160, low2: 90, high2: 130 },
        { x: new Date('2023-01-03'), low1: 120, high1: 170, low2: 100, high2: 140 },
      ])}>Change Data</button>
    </div>
  );
};

export default RangeAreaChart;


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
