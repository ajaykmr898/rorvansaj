import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, AddEdit } from "components/users";
import { userService, alertService } from "services";
import Link from "next/link";

export default Reglink;

function Reglink() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(null);

  useEffect(() => {
    console.log(router);
    const { id } = router.query;

    if (!id) return;

    userService
      .getByRegLink(id)
      .then((x) => {
        setUser(x);
        let y = true;
        setValid(y);
      })
      .catch(alertService.error);
  }, [router]);

  return (
    <div className="p-4">
      <div className="container">
        <h1>Hi {user ? user?.firstName : ""}!</h1>
        {valid ? (
          <p>You have been signed up</p>
        ) : valid === false ? (
          <p>Link not valid</p>
        ) : (
          <p>Validating...</p>
        )}
        <p>
          <Link href="/account/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
