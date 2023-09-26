import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, AddEdit } from "components/users";
import { userService, alertService } from "services";

export default Edit;

function Edit() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    // fetch user and set default form values if in edit mode
    userService
      .getById(id)
      .then((x) => setUser(x))
      .catch((err) => alertService.error(err));
  }, [router]);

  return (
    <Layout>
      <h1>Edit User</h1>
      {user ? <AddEdit user={user} /> : <p>loading...</p>}
    </Layout>
  );
}
