import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, AddEdit } from "components/offers";
import { offersService, alertService, cloudConfig } from "services";
import axios from "axios";

export default Edit;

function Edit() {
  const router = useRouter();
  const config = cloudConfig();
  let folder = "";
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch offer and set default form values if in edit mode
    offersService
      .getById(id)
      .then((x) => {
        setOffer(x.data);
        setIsLoading(false);
        folder = "offers/" + x.data.id;

        axios
          .get(
            `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image/upload?folder=${folder}`,
            {
              "Content-Type": "multipart/form-data",
              Authorization: `Basic ${Buffer.from(
                `${config.apiKey}:${config.apiSecret}`
              ).toString("base64")}`,
            }
          )
          .then((response) => {
            console.log(response);
            // Extract image URLs from the response
            const imageUrls = response.data.resources.map((image) => image.url);
            setImages(imageUrls);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit Offer</h1>
      {offer && <AddEdit images={images} offer={offer} />}
    </Layout>
  );
}
