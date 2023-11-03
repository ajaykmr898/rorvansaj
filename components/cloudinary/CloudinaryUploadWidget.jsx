import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { cloudConfig } from "../../services";
function CloudinaryUploadWidget({ load }) {
  const [files, setFiles] = useState(null);

  const config = cloudConfig();

  function readInput(e) {
    let input = e.target;
    const dt = new DataTransfer();
    if (input.files && input.files[0]) {
      for (let i = 0; i < input.files.length; i++) {
        let file = input.files[i];
        let fileName = file.name;
        let fi = fileName.split(".");
        let fls = fi.length;
        let fe = fi[fls - 1].toLowerCase();
        if (
          fls > 1 &&
          (fe.includes("jpg") || fe.includes("png") || fe.includes("jpeg"))
        ) {
          dt.items.add(file);
        }
      }
      input.files = dt.files;
      setFiles(input.files);
    }
  }

  function deleteItem(index) {
    const dt = new DataTransfer();
    const input = document.getElementById("filesInput");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (parseInt(index) !== i) {
        dt.items.add(file);
      }
    }

    input.files = dt.files;
    setFiles(input.files);
  }

  function getFileName(f) {
    let nameL = f.name.length;
    let nameS = f.name;
    let nameF = "";
    if (nameL > 25) {
      nameS = f.name.substring(0, 20);
      nameF = "..." + f.name.substring(f.name.length - 4, f.name.length);
    }
    return nameS + nameF;
  }

  const confirmUpload = () => {
    //console.log(files);
    let formDatas = [];
    for (const file of files) {
      const formData = new FormData();
      const renamedFile = new File([file], "desired-filename.jpg", {
        type: file.type,
      });
      formData.append("file", renamedFile);
      formData.append("upload_preset", config.preset);
      //formData.append("use_filename", "true");
      //formData.append("folder", folder);

      formDatas.push(formData);
    }
    load(formDatas);
  };

  return (
    <div id="uploadFile">
      <div id="FileUpload">
        <div className="wrapper">
          <div className="image-upload-wrap">
            <input
              id="filesInput"
              className="file-upload-input"
              type="file"
              name="files[]"
              accept="image/jpeg, image/jpg, image/png"
              multiple
              onChange={(event) => {
                readInput(event);
              }}
            />
            <div className="drag-text">
              <h3>Drag and drop files or click to upload</h3>
            </div>
          </div>
        </div>
        <Grid container spacing={2}>
          {files &&
            files.length > 0 &&
            Object.keys(files).map((f, i) => (
              <Grid item key={i}>
                <div key={i} className="uploaded">
                  <div className="file">
                    <div className="file__name">
                      <p>{getFileName(files[i])}</p>
                      <DeleteIcon
                        className="fas fa-times delete"
                        onClick={() => deleteItem(i)}
                      ></DeleteIcon>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
        </Grid>
        <br />
        <div id="filenames"></div>
        <br />
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            disabled={!files || files.length <= 0}
            onClick={confirmUpload}
          >
            Confirm Files
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default CloudinaryUploadWidget;
