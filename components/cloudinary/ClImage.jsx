import { cloudConfig } from "services";
import * as React from "react";
import { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
export default ClImage;

function ClImage({ id }) {
  const [image, setImage] = useState(null);

  const config = cloudConfig();
  const myCld = new Cloudinary({
    cloud: config,
  });

  useEffect(() => {
    setImage(myCld.image(id));
  }, []);

  return (
    <div className="imgContainer">
      {image && (
        <div>
          <AdvancedImage cldImg={image} />
          <DeleteIcon
            className="fas fa-times delete"
            onClick={() => deleteItem(i)}
          ></DeleteIcon>
        </div>
      )}
    </div>
  );
}
