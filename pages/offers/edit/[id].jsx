import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, AddEdit } from "components/offers";
import {
  offersService,
  alertService,
  cloudConfig,
  filesService,
  locationsService,
} from "services";
import axios from "axios";

export default Edit;

function Edit() {
  const router = useRouter();
  const config = cloudConfig();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch offer and set default form values if in edit mode
    offersService
      .getById(id)
      .then((x) => {
        locationsService
          .getAllByUserOfferId(id, "offer")
          .then((y) => {
            setOffer(x.data);
            setIsLoading(false);
            setLocations(y.data);
          })
          .catch((err) => alertService.error(err));

        filesService.getAllByOfferId(id).then((res) => {
          setImages(res.data);
        });
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit Offer</h1>
      {offer && <AddEdit images={images} offer={offer} locations={locations} />}
    </Layout>
  );
}
