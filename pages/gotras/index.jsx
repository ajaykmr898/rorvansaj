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
import AnyChart from "anychart";
const RangeAreaChart = () => {
  const [data, setData] = useState([
    {
      x: 10,
      y: 50,
      low: 30,
      high: 70,
    },
    {
      x: 20,
      y: 60,
      low: 40,
      high: 80,
    },
    {
      x: 30,
      y: 70,
      low: 50,
      high: 90,
    },
    {
      x: 40,
      y: 80,
      low: 60,
      high: 100,
    },
  ]);

  const handleChange = (event) => {
    const newData = [...data];
    newData[event.target.name] = event.target.value;
    setData(newData);
  };

  return (
    <div>
      <AnyChart width={1000} height={500} type="rangeAreaChart" data={data}>
        <anychart.scales.linear
          y={[
            {
              id: "y",
              title: "Value",
              minimum: 0,
              maximum: 100,
            },
            {
              id: "low",
              overlay: true,
              color: "#999",
              stroke: {
                width: 1,
              },
            },
            {
              id: "high",
              overlay: true,
              color: "#aaa",
              stroke: {
                width: 1,
              },
            },
          ]}
        />

        <anychart.chart.series.rangeArea
          id="rangeArea"
          area={true}
          fill="#ff0000"
          data={[{ x: "x", low: "low", high: "high" }]}
        />
      </AnyChart>

      <button
        onClick={() => handleChange({ target: { name: "low", value: 10 } })}
      >
        Change Low Value
      </button>

      <button
        onClick={() => handleChange({ target: { name: "high", value: 90 } })}
      >
        Change High Value
      </button>
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
      {gotras && gotras.length > 0 && (
        <MUIDataTable
          title="Gotras"
          data={gotras}
          columns={columns}
          options={options}
        />
      )}
      {gotras && gotras.length === 0 && (
        <MUIDataTable columns={columns} options={options} />
      )}
      wegdsd wgsdf
      <RangeAreaChart />
    </Layout>
  );
}
