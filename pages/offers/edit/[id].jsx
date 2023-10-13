import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, AddEdit } from "components/offers";
import { offersService, alertService } from "services";

export default Edit;

function Edit() {
  const router = useRouter();
  const [offer, setOffer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch offer and set default form values if in edit mode
    offersService
      .getById(id)
      .then((x) => {
        setOffer(x.data);
        setIsLoading(false);
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit Offer</h1>
      {offer && <AddEdit offer={offer} />}
    </Layout>
  );
}
