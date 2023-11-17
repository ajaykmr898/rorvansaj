import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";
import { gotrasService, alertService } from "services";
import { useFormik } from "formik";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";
import { useState } from "react";

export { AddEdit };

function AddEdit(props) {
  const gotra = props?.gotra;
  const router = useRouter();
  const [houseAddress, setHouseAddress] = useState(false);
  const [houseChanged, setHouseAddressChanged] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: gotra?.name ? gotra.name : "",
      desc: gotra?.desc ? gotra.desc : "",
      history: gotra?.history ? gotra.history : "",
      rors: gotra?.rors ? gotra.rors : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      desc: Yup.string(),
      history: Yup.string(),
      rors: Yup.string(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(data) {
    try {
      let message = "Gotra added";
      let res = null;
      if (houseChanged && Object.keys(houseAddress).length <= 0) {
        alertService.warning("Insert correct address");
        return false;
      }
      if (!gotra) {
        data.deleted = "false";
        res = await gotrasService.create(data);
      } else {
        message = "Gotra edited";
        res = await gotrasService.update(gotra.id, data);
      }
      if (res) {
        alertService.success(message);
        router.push("/gotras");
      } else {
        alertService.error(
          "Gotra saved, An error occurred while uploading files"
        );
      }
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  const handleAddressChange = (newAddress, id) => {
    //console.log(id, newAddress);
    setHouseAddress(newAddress);
    setHouseAddressChanged(true);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              label="name"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="desc"
              name="desc"
              fullWidth
              id="desc"
              label="desc"
              {...formik.getFieldProps("desc")}
              error={formik.touched.desc && Boolean(formik.errors.desc)}
              helperText={formik.touched.desc && formik.errors.desc}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="history"
              name="history"
              fullWidth
              id="history"
              label="history"
              {...formik.getFieldProps("history")}
              error={formik.touched.history && Boolean(formik.errors.history)}
              helperText={formik.touched.history && formik.errors.history}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="rors"
              name="rors"
              fullWidth
              id="rors"
              label="rors"
              {...formik.getFieldProps("rors")}
              error={formik.touched.rors && Boolean(formik.errors.rors)}
              helperText={formik.touched.rors && formik.errors.rors}
            />
          </Grid>
        </Grid>
        <br />
        <Button
          type="submit"
          color="success"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
        <Link href="/gotras">Cancel</Link>
      </form>
    </ThemeProvider>
  );
}
