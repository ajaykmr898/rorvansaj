import { offersService, userService, chartService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { List } from "../components/offers";
import Button from "@mui/material/Button";
import { Chart } from "../components/charts";
export default Home;

function Home() {
  const [error, setError] = useState("");
  const [offers, setOffers] = useState(null);
  const [chart, setChart] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const loadOffers = async () => {
    let res = await offersService.getAllOffers();
    setError(res[0]);
    setOffers(res[1]);
  };

  const test = async () => {};

  const loadChart = async () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount === 3) {
      let res = await chartService.getAll();
      setChart(res);
      setClickCount(0);
    }
  };

  return (
    <Layout>
      <Typography variant="h6" onClick={loadChart} className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
      <br />
      <Button onClick={loadOffers}>Load Ad/New/Offers</Button>
      <br />
      <Typography className="text-center">{error}</Typography>
      {offers && offers.length > 0 ? <List items={offers} /> : ""}
      {chart && Object.keys(chart).length > 0 ? <Chart data={chart} /> : ""}
    </Layout>
  );
}
