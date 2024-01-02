import { useRouter } from "next/router";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";

export { Chart };
function Chart(props) {
  const router = useRouter();
  const defaultTheme = createTheme();
  let { dataOC, dataHL, deltaOC, deltaHL } = props.data;

  highchartsMore(Highcharts); // Data for the area range chart

  const options1 = {
    chart: {
      type: "arearange",
      zoomType: "x",
    },
    title: {
      text: "Area Range Chart",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    plotOptions: {
      arearange: {
        lineWidth: 1,
        lineColor: "#333",
        fillOpacity: 0.2,
        zIndex: 0,
      },
    },
    series: [
      {
        name: "Open/Close",
        data: dataOC,
        zIndex: 1,
      },
      {
        name: "High/Low",
        data: dataHL,
        zIndex: 1,
      },
    ],
  };

  const options2 = {
    chart: {
      type: "line",
      zoomType: "x",
    },
    title: {
      text: "Line Chart",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Value",
      },
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 4,
        },
      },
    },
    series: [
      {
        name: "Delta Open/Close",
        data: deltaOC,
        zIndex: 1,
      },
      {
        name: "Delta High/Low",
        data: deltaHL,
        zIndex: 1,
      },
    ],
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <HighchartsReact highcharts={Highcharts} options={options1} />
      <HighchartsReact highcharts={Highcharts} options={options2} />
    </ThemeProvider>
  );
}
