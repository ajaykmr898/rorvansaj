import { relationsService, userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default Home;

function Home() {
  const test = async () => {};

  return (
    <Layout>
      <Typography variant="h6" onClick={test} className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
    </Layout>
  );
}
