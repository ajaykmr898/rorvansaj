import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";
import { offersService, alertService, userService } from "services";
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
import CloudinaryUploadWidget from "../cloudinary/CloudinaryUploadWidget";

export { AddEdit };

function AddEdit(props) {
  const offer = props?.offer;
  const router = useRouter();
  const [visibilityAddress, setVisibilityAddress] = useState(false);
  const [visibilityChanged, setVisibilityAddressChanged] = useState(false);

  const formik = useFormik({
    initialValues: {
      types: offer?.types ? offer.types : "",
      title: offer?.title ? offer.title : "",
      description: offer?.description ? offer.description : "",
      from: offer?.from ? offer.from : "",
      to: offer?.to ? offer.to : "",
      //visibility: offer?.visibility ? offer.visibility : "",
      charge: offer?.charge ? offer.charge : "",
    },
    validationSchema: Yup.object({
      types: Yup.string().required("Type is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
      from: Yup.date().required("From is required"),
      to: Yup.date().required("To is required"),
      //visibility: Yup.string().required("visibility is required"),
      charge: Yup.string().required("Charge is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(data) {
    try {
      let message = "Offer added";
      if (visibilityChanged && Object.keys(visibilityAddress).length <= 0) {
        alertService.warning("Insert correct address");
        return false;
      }
      data = { ...data, userId: userService?.userValue?.id };
      if (!offer) {
        data.visibility = visibilityAddress;
        await offersService.create(data);
      } else {
        data.visibility = visibilityChanged
          ? visibilityAddress
          : data.visibility;
        await offersService.update(offer.id, data);
      }
      // redirect to offer list with success message
      router.push("/offers");
      alertService.success(message);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  const handleAddressChange = (newAddress, id) => {
    console.log(id, newAddress);
    setVisibilityAddress(newAddress);
    setVisibilityAddressChanged(true);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="title"
              name="title"
              required
              fullWidth
              id="title"
              label="Title"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              {...formik.getFieldProps("description")}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                Type *
              </InputLabel>
              <Select
                required
                fullWidth
                id="types"
                label="Types"
                name="types"
                autoComplete="types"
                {...formik.getFieldProps("types")}
                error={formik.touched.types && Boolean(formik.errors.types)}
              >
                <MenuItem value="1">Ad</MenuItem>
                <MenuItem value="2">News</MenuItem>
                <MenuItem value="3">Offer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                From
              </InputLabel>
              <OutlinedInput
                required
                fullWidth
                id="dob"
                label="From"
                type="date"
                name="from"
                autoComplete="from"
                variant="outlined"
                {...formik.getFieldProps("from")}
                error={formik.touched.from && Boolean(formik.errors.from)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                To
              </InputLabel>
              <OutlinedInput
                required
                fullWidth
                id="to"
                label="To"
                type="date"
                name="to"
                autoComplete="to"
                variant="outlined"
                {...formik.getFieldProps("to")}
                error={formik.touched.to && Boolean(formik.errors.to)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Place
              id="visibility"
              placeholder="Destination *"
              onAddressChange={handleAddressChange}
              defaultValue={
                offer?.visibility
                  ? offer?.visibility?.formattedAddress || ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="charge"
              label="Charge"
              name="charge"
              type="number"
              autoComplete="charge"
              {...formik.getFieldProps("charge")}
              error={formik.touched.charge && Boolean(formik.errors.charge)}
              helperText={formik.touched.charge && formik.errors.charge}
            ></TextField>
          </Grid>
        </Grid>
        <br />
        <CloudinaryUploadWidget />
        <Button
          type="submit"
          color="success"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
        <Link href="/offers">Cancel</Link>
      </form>
    </ThemeProvider>
  );
}
