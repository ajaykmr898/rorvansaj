import { userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";
import ClImage from "../components/cloudinary/ClImage";
export default Home;

function Home() {
  const handleUpload = async (event) => {
    const file = document.querySelector("#upload-file").files[0];
    console.log(file);
  };

  return (
    <Layout>
      <Typography variant="h6" className="text-center">
        Welcome <br />
        {userService.name}
        <input type="file" id="upload-file" accept="image/*" />
        <button onClick={handleUpload}>fg</button>
        <ClImage id="icpfv4nawph9mohup9dg" />
      </Typography>
    </Layout>
  );
}
