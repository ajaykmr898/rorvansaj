import {
  locationsService,
  offersService,
  relationsService,
  userService,
} from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { List } from "../components/offers";
export default Home;

function Home() {
  const [error, setError] = useState("");
  const [offers, setOffers] = useState(null);
  const test = async () => {
    setOffers(null);
    let id = userService?.userValue.id;
    //id = "65280bc90adeb1a81711ddfc";
    let res = await locationsService.getAllByUserOfferId(id, "user");

    if (res && res.success) {
      let places = (res?.data || []).map((x) => {
        return x.location.placeId;
      });
      if (places.length) {
        let res2 = await locationsService.getAllByLocations(places);
        if (res2 && res2.success) {
          let offers = await offersService.getAllById(res2?.data);
          if (offers && offers.success) {
            if (offers?.data.length) {
              setError(offers?.data.length + " offers found");
              setOffers(offers?.data);
              //console.log(res, res2, offers);
            } else {
              setError("No offers found");
            }
          } else {
            setError("Error while getting offers");
          }
        } else {
          setError("Error while getting offers");
        }
      } else {
        setError("No saved locations found for user");
      }
    } else {
      setError("Error while getting offers");
    }
  };

  return (
    <Layout>
      <Typography variant="h6" onClick={test} className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
      <br />
      <span>{error}</span>
      {offers && offers.length > 0 ? <List items={offers} /> : ""}
    </Layout>
  );
}
