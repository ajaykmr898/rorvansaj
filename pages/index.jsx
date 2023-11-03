import { offersService, userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { List } from "../components/offers";
import Button from "@mui/material/Button";
export default Home;

function Home() {
  const [error, setError] = useState("");
  const [offers, setOffers] = useState(null);

  const loadOffers = async () => {
    let res = await offersService.loadOffers();
    setError(res[0]);
    setOffers(res[1]);
  };

  const test = () => {};

  return (
    <Layout>
      <Typography variant="h6" onClick={test} className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
      <br />
      <Button onClick={loadOffers}>Load Ad/New/Offers</Button>
      <br />
      <Typography className="text-center">{error}</Typography>
      {offers && offers.length > 0 ? <List items={offers} /> : ""}
    </Layout>
  );
}
