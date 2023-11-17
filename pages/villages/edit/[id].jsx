import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, AddEdit } from "components/marriage";
import {
  marriagesService,
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
  const [marriage, setMarriage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch marriage and set default form values if in edit mode
    marriagesService
      .getById(id)
      .then((x) => {
        setMarriage(x.data);
        setIsLoading(false);
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit Marriage</h1>
      {marriage && (
        <AddEdit images={images} marriage={marriage} locations={locations} />
      )}
    </Layout>
  );
}
