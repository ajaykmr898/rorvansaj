import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { userService, alertService } from "services";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Typography from "@mui/material/Typography";

const defaultTheme = createTheme();

export default function Register() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (user) => {
    setButtonDisabled(true);
    setIsLoading(true);
    user.firstName = user.firstName.trim();
    user.lastName = user.lastName.trim();
    user.regLink = uuidv4();
    user.isSignedUp = "false";
    user.regLinkMail =
      "https://" + window.location.host + "/account/reglink/" + user.regLink;
    return userService
      .register(user)
      .then((res) => {
        userService
          .sendRegMail(user)
          .then(() => {
            alertService.success(
              "User registered successfully, please follow the instructions received by email"
            );
            router.push("login");
          })
          .catch((err) => {
            // @todo manage user delete without login
            // userService.delete(res.id).catch();
            alertService.error(
              "An error occurred. Please recreate your account."
            );
          });
      })
      .catch((err) => {
        setIsError(true);
        setError(err);
      })
      .finally(() => {
        setButtonDisabled(false);
        setIsLoading(false);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: "100vh",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Sign up</h3>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    {...formik.getFieldProps("firstName")}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    {...formik.getFieldProps("lastName")}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    {...formik.getFieldProps("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Grid>
              </Grid>
              <Typography className="is-invalid text-center">
                {isError ? (
                  <>
                    <br />
                    {error}
                  </>
                ) : (
                  ""
                )}
              </Typography>
              <Button
                disabled={buttonDisabled}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
              <Link href="/login">Sign in</Link>
            </form>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
