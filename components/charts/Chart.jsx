import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";

export { Chart };
function Chart(props) {
  const router = useRouter();
  const defaultTheme = createTheme();
  const { dataOC, dataHL } = props.data;
  console.log(props.data);
  highchartsMore(Highcharts); // Data for the area range chart

  const options = {
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
  return (
    <ThemeProvider theme={defaultTheme}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ThemeProvider>
  );
}
