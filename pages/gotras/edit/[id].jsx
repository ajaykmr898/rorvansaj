import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, AddEdit } from "components/gotras";
import { gotrasService, alertService } from "services";

export default Edit;

function Edit() {
  const router = useRouter();
  const [gotra, setGotra] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch gotra and set default form values if in edit mode
    gotrasService
      .getById(id)
      .then((x) => {
        setGotra(x.data);
        setIsLoading(false);
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit Gotra</h1>
      {gotra && <AddEdit gotra={gotra} />}
    </Layout>
  );
}
