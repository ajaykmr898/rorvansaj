import { userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";

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
