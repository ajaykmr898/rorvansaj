import Link from "next/link";
import { userService } from "services";
import { Layout } from "../components/users";
import { Place } from "../components/maps";
import Typography from "@mui/material/Typography";
import * as React from "react";
import MapDialog from "../components/users/Relations/RelationsMap";

export default Home;

function Home() {
  return (
    <Layout>
      <Typography variant="h6" className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
    </Layout>
  );
}
