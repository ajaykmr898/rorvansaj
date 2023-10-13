import { cloudConfig } from "services";
import * as React from "react";
import { useEffect, useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
export default ClImage;

function ClImage({ id }) {
  const [image, setImage] = useState(null);

  const config = cloudConfig();
  const myCld = new Cloudinary({
    cloud: config,
  });

  useEffect(() => {
    setImage(myCld.image(id));
    console.log(image, myCld.image(id), "f");
  }, []);

  return (
    <div className="imgContainer">
      {image && <AdvancedImage cldImg={image} />}
    </div>
  );
}
