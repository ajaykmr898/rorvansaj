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
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Legend,
  Tooltip as Tp,
  ReferenceArea,
} from "recharts";

const RangeAreaChart = () => {
  // Data for the range area chart
  const data = [
    { date: "2023-01-01", low1: 5, high1: 15 },
    { date: "2023-01-02", low1: 10, high1: 20 },
    { date: "2023-01-03", low1: 15, high1: 25 },
    // Add more data as needed
  ];
  return (
    <AreaChart
      width={600}
      height={400}
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tp />
      <Legend />
      <Area type="monotone" dataKey="low1" stackId="1" />
      <Area type="monotone" dataKey="high1" stackId="1" />
    </AreaChart>
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
