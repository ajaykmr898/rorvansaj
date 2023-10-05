import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Layout, AddEdit } from "components/users";
import { userService, alertService } from "services";
import Link from "next/link";
import moment from "moment";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default Reglink;
const defaultTheme = createTheme();

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
        x = x.data;
        setUser(x);
        let y =
          moment(x.regExpTime).isAfter(moment()) && x.isSignedUp === "false";
        if (y) {
          // update
          let z = { ...x, isSignedUp: true, regExpTime: "" };
          userService
            .updateUser(z)
            .then(() => {
              setValid(y);
            })
            .catch(() => {
              alertService.error("An error occurred while updating user");
            });
        } else {
          setValid(y);
        }
      })
      .catch(() => {
        setValid(false);
        setUser({});
        alertService.error("An error occurred or link not valid, please retry");
      });
  }, [router]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "100vh",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />{" "}
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>Hi {user && user.firstName ? user?.firstName : "user"}!</h1>
            {valid ? (
              <p>You have been signed up correctly</p>
            ) : valid === false ? (
              <p>Link not valid</p>
            ) : (
              <p>Validating...</p>
            )}
            <p>
              <Link href="/account/login">Login</Link>
            </p>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
