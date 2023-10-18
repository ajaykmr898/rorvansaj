import { cloudConfig, userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import CloudinaryUploadWidget from "../components/cloudinary/CloudinaryUploadWidget";
import axios from "axios";
import ClImage from "../components/cloudinary/ClImage";
import Grid from "@mui/material/Grid";
export default Home;

function Home() {
  return (
    <Layout>
      <Typography variant="h6" className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
      <br />
      <Grid container spacing={2}>
        <Grid item>
          <ClImage id="sdfhgj/ywsognajssabnpnzsspk" />
        </Grid>
        <Grid item>
          <ClImage id="sdfhgj/ywsognajssabnpnzsspk" />
        </Grid>
        <Grid item>
          <ClImage id="sdfhgj/ywsognajssabnpnzsspk" />
        </Grid>
        <Grid item>
          <ClImage id="sdfhgj/ywsognajssabnpnzsspk" />
        </Grid>
      </Grid>
    </Layout>
  );
}
