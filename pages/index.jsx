import { cloudConfig, userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import CloudinaryUploadWidget from "../components/cloudinary/CloudinaryUploadWidget";
import axios from "axios";
export default Home;

function Home() {
  const config = cloudConfig();
  const load = (data1) => {
    data1.map((formData) => {
      axios
        .post(
          `https://api.cloudinary.com/v1_1/${config.cloudName}/upload`,
          formData,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${Buffer.from(
              `${config.apiKey}:${config.apiSecret}`
            ).toString("base64")}`,
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <Layout>
      <Typography variant="h6" className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
      <CloudinaryUploadWidget load={load} />
    </Layout>
  );
}
