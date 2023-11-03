import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";
import { marriagesService, alertService, userService } from "services";
import { useFormik } from "formik";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Place } from "../maps";
import { useState } from "react";

export { AddEdit };

function AddEdit(props) {
  const marriage = props?.marriage;
  const router = useRouter();
  const [houseAddress, setHouseAddress] = useState(false);
  const [houseChanged, setHouseAddressChanged] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: marriage?.name ? marriage.name : "",
      extraInfo: marriage?.extraInfo ? marriage.extraInfo : "",
      gender: marriage?.gender ? marriage.gender : "",
      study: marriage?.study ? marriage.study : "",
      job: marriage?.job ? marriage.job : "",
      age: marriage?.age ? marriage.age : "",
      phone: marriage?.phone ? marriage.phone : "",
      email: marriage?.email ? marriage.email : "",
      status: marriage?.status ? marriage?.status : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      extraInfo: Yup.string(),
      study: Yup.string().required("Study is required"),
      job: Yup.string().required("Job is required"),
      age: Yup.string().required("Age is required"),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().required("Email is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(data) {
    try {
      let message = "Marriage added";
      let res = null;
      if (houseChanged && Object.keys(houseAddress).length <= 0) {
        alertService.warning("Insert correct address");
        return false;
      }
      data = { ...data, userId: userService?.userValue?.id };
      if (!marriage) {
        data.address = houseAddress;
        data.deleted = "false";
        res = await marriagesService.create(data);
      } else {
        message = "Marriage edited";
        data.address = houseChanged ? houseAddress : data.address;
        res = await marriagesService.update(marriage.id, data);
      }
      if (res) {
        alertService.success(message);
        router.push("/marriage");
      } else {
        alertService.error(
          "Marriage saved, An error occurred while uploading files"
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
              autoComplete="FullName"
              name="name"
              required
              fullWidth
              id="name"
              label="FullName"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="age"
              name="age"
              required
              fullWidth
              id="age"
              label="age"
              {...formik.getFieldProps("age")}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="job"
              name="job"
              required
              fullWidth
              id="job"
              label="job"
              {...formik.getFieldProps("job")}
              error={formik.touched.job && Boolean(formik.errors.job)}
              helperText={formik.touched.job && formik.errors.job}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="study"
              name="study"
              required
              fullWidth
              id="study"
              label="study"
              {...formik.getFieldProps("study")}
              error={formik.touched.study && Boolean(formik.errors.study)}
              helperText={formik.touched.study && formik.errors.study}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                Gender *
              </InputLabel>
              <Select
                required
                fullWidth
                id="gender"
                label="Gender"
                name="gender"
                autoComplete="gender"
                {...formik.getFieldProps("gender")}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="phone"
              name="phone"
              required
              fullWidth
              id="phone"
              label="phone"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="email"
              name="email"
              required
              fullWidth
              id="email"
              label="email"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                Status *
              </InputLabel>
              <Select
                required
                fullWidth
                id="status"
                label="Status"
                name="status"
                autoComplete="status"
                {...formik.getFieldProps("status")}
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="extraInfo"
              label="Extra Info"
              name="extraInfo"
              autoComplete="extraInfo"
              {...formik.getFieldProps("extraInfo")}
              error={
                formik.touched.extraInfo && Boolean(formik.errors.extraInfo)
              }
              helperText={formik.touched.extraInfo && formik.errors.extraInfo}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Place
              id="house"
              placeholder="Destination *"
              onAddressChange={handleAddressChange}
              isRequired={true}
              defaultValue={
                marriage?.address
                  ? marriage?.address?.formattedAddress || ""
                  : ""
              }
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
        <Link href="/marriage">Cancel</Link>
      </form>
    </ThemeProvider>
  );
}
