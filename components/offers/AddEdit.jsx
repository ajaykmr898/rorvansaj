import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";
import {
  offersService,
  alertService,
  userService,
  cloudConfig,
  filesService,
  locationsService,
} from "services";
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
import axios from "axios";
import ClImage from "../cloudinary/ClImage";
import { AddEditPlaces } from "../maps/AddEditPlaces";

export { AddEdit };

function AddEdit(props) {
  const offer = props?.offer;
  const locations = props?.locations || [];
  const [addresses, setAddresses] = useState([]);
  const [addressToRemove, setAddressToRemove] = useState([]);
  const images = props?.images || [];
  const config = cloudConfig();
  let folder = "";
  const currentDate = new Date().toISOString().split("T")[0];
  const router = useRouter();
  const [formData, setFormData] = useState([]);
  const [visibilityAddress, setVisibilityAddress] = useState(false);
  const [visibilityChanged, setVisibilityAddressChanged] = useState(false);
  const [imagesDeleted, setImagesDeleted] = useState([]);

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
      to: Yup.date()
        .required("To is required")
        .min(
          Yup.ref("from"),
          "To Date must be greater than or equal to From Date"
        ),
      //visibility: Yup.string().required("visibility is required"),
      charge: Yup.string().required("Charge is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const deleteImages = (id, publicId) => {
    setImagesDeleted((temp) => {
      return [...temp, { id, publicId }];
    });
  };

  const insertDb = async (id, publicId) => {
    await filesService.create({ offerId: id, url: publicId, deleted: "false" });
  };

  const removeFiles = () => {
    imagesDeleted.map(async (img) => {
      await filesService.delete(img.id);
    });
    /*axios
        .delete(
          `${config.url}/${config.cloudName}/image/upload/${img.publicId}`,
          {
            Authorization: `Basic ${Buffer.from(
              `${config.apiKey}:${config.apiSecret}`
            ).toString("base64")}`,
            "X-Requested-With": "XMLHttpRequest",
          }
        )
        .then(async (res) => {
          await filesService.delete(img.id);
        });
    });*/
  };

  const addLocation = (a, b) => {
    setAddresses(a);
    setAddressToRemove(b);
  };

  const uploadFiles = (id) => {
    folder = "offers/" + id;
    let formDatas = [...formData].map((form) => {
      form.append("folder", folder);
      return form;
    });

    formDatas.map((formData) => {
      axios
        .post(`${config.url}/${config.cloudName}/upload`, formData, {
          "Content-Type": "multipart/form-data",
          Authorization: `Basic ${Buffer.from(
            `${config.apiKey}:${config.apiSecret}`
          ).toString("base64")}`,
        })
        .then(async (res) => {
          const publicId = res?.data?.public_id;
          await insertDb(id, publicId);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  async function onSubmit(data) {
    try {
      let message = "Offer added";
      let res = null;
      if (visibilityChanged && Object.keys(visibilityAddress).length <= 0) {
        alertService.warning("Insert correct address");
        return false;
      }
      data = { ...data, userId: userService?.userValue?.id };
      if (!offer) {
        message = "Offer edited";
        data.visibility = visibilityAddress;
        data.deleted = "false";
        res = await offersService.create(data);
      } else {
        data.visibility = visibilityChanged
          ? visibilityAddress
          : data.visibility;
        res = await offersService.update(offer.id, data);
      }
      addresses.map((a) => {
        let x = {
          address: "a",
          location: a,
          deleted: "false",
          type: offersService[res.types] || "",
          offerId: offer.id,
          userId: offer.id,
        };
        locationsService.create(x);
      });
      addressToRemove.map((a) => {
        locationsService.delete(a);
      });
      if (res) {
        uploadFiles(res.data.id);
        removeFiles();
        alertService.success(message);
        router.push("/offers");
      } else {
        alertService.error(
          "Offer saved, An error occurred while uploading files"
        );
      }
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

  const load = (datas) => {
    setFormData(datas);
  };

  const handleDateChange = (event, field) => {
    const selectedDate = event.target.value;
    if (field === "from") {
      //if ()
    } else {
    }
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
                {offersService.offerTypes.map((value, i) => (
                  <MenuItem key={`m-item-${i}`} value={i}>
                    {value}
                  </MenuItem>
                ))}
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
                onChange={(ev) => handleDateChange(ev, "from")}
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
                onChange={(ev) => handleDateChange(ev, "to")}
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
              isRequired={true}
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
        <Grid container spacing={2}>
          {images.map((f, i) => (
            <Grid key={`grid-${i}`} item>
              <ClImage
                key={`img-${i}`}
                img={f.id}
                id={f.url}
                deleteImage={deleteImages}
              />
            </Grid>
          ))}
        </Grid>
        <br />
        <CloudinaryUploadWidget load={load} />
        <br />
        <AddEditPlaces locations={locations} addLocation={addLocation} />
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
