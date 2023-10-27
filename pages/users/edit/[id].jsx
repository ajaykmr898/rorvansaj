import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, AddEdit } from "components/users";
import { userService, alertService, locationsService } from "services";

export default Edit;

function Edit() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch user and set default form values if in edit mode
    userService
      .getById(id)
      .then((x) => {
        locationsService
          .getAllByUserId(id)
          .then((y) => {
            setUser(x.data);
            setIsLoading(false);
            setLocations(y.data);
          })
          .catch((err) => alertService.error(err));
      })
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout isLoading={isLoading}>
      <h1>Edit User</h1>
      {user && <AddEdit user={user} locations={locations} />}
    </Layout>
  );
}
