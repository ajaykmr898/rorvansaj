import { cloudConfig } from "services";
import * as React from "react";
import { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
export default ClImage;

function ClImage({ id, img, deleteImage }) {
  const [image, setImage] = useState(null);
  const [hidden, setHidden] = useState(false);

  const config = cloudConfig();
  const myCld = new Cloudinary({
    cloud: config,
  });

  useEffect(() => {
    setImage(myCld.image(id));
  }, []);

  const deleteItem = () => {
    deleteImage(img, id);
    setHidden(true);
  };

  return (
    <div className="imgContainer">
      {image && (
        <div>
          <AdvancedImage cldImg={image} />
          {deleteImage && (
            <div hidden={hidden} className="text-center">
              <DeleteIcon
                className="fas fa-times delete"
                onClick={() => deleteItem()}
              ></DeleteIcon>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
