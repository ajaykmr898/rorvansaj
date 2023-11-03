import { useRouter } from "next/router";
import Link from "next/link";
import * as Yup from "yup";
import { userService, alertService, locationsService } from "services";
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
import moment from "moment";
import { AddEditPlaces } from "../maps/AddEditPlaces";

export { AddEdit };

function AddEdit(props) {
  const user = props?.user;
  const locations = props?.locations || [];
  const [addressToRemove, setAddressToRemove] = useState([]);
  const router = useRouter();
  const [por, setPorAddress] = useState({});
  const [pob, setPobAddress] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [porChanged, setPorAddressChanged] = useState(false);
  const [pobChanged, setPobAddressChanged] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName ? user.firstName : "",
      lastName: user?.lastName ? user.lastName : "",
      dob: user?.dob ? user.dob : "",
      gender: user?.gender ? user.gender : "",
      level: user?.level ? user.level : "",
      phone: user?.phone ? user.phone : "",
      email: user?.email ? user.email : "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      dob: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      level: Yup.string().required("Level is required"),
      phone: Yup.string(),
      email: Yup.string().email().required("Email is required"),
      password: Yup.string()
        .transform((x) => (x === "" ? undefined : x))
        // password optional in edit mode
        .concat(
          user?.firstName ? null : Yup.string().required("Password is required")
        )
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  async function onSubmit(data) {
    try {
      let message = "User added";
      if (
        (pobChanged && Object.keys(pob).length <= 0) ||
        (porChanged && Object.keys(por).length <= 0)
      ) {
        alertService.warning("Insert both correct addresses");
        return false;
      }
      if (moment(data.dob).isAfter(currentDate)) {
        alertService.warning("Please select a past date as Date of Birth");
        return false;
      }
      let userx = user;
      if (user) {
        data.pob = pobChanged ? pob : user.pob;
        data.por = porChanged ? por : user.por;
        await userService.update(user.id, data);
        message = "User updated";
      } else {
        data.pob = pob;
        data.por = por;
        data.isSignedUp = "true";
        data.deleted = "false";
        userx = await userService.register(data);
      }
      //add
      addresses.map((a) => {
        let x = {
          //address: "a",
          location: a,
          deleted: "false",
          type: "User",
          userId: userx.id,
        };
        locationsService.create(x);
      });
      //delete
      addressToRemove.map((a) => {
        locationsService.delete(a);
      });
      // redirect to user list with success message
      router.push("/users");
      alertService.success(message);
    } catch (error) {
      alertService.error(error);
      console.error(error);
    }
  }

  const addLocation = (a, b) => {
    setAddresses(a);
    setAddressToRemove(b);
  };

  const handleAddressChange = (newAddress, id) => {
    //console.log(id, newAddress);
    if (id === "por") {
      setPorAddress(newAddress);
      setPorAddressChanged(true);
    } else if (id === "pob") {
      setPobAddress(newAddress);
      setPobAddressChanged(true);
    } else {
      //setPosAddress(newAddress);
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
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
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
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
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                Date of birth *
              </InputLabel>
              <OutlinedInput
                required
                fullWidth
                id="dob"
                label="Date of birth *"
                type="date"
                name="dob"
                max={currentDate}
                autoComplete="dob"
                variant="outlined"
                {...formik.getFieldProps("dob")}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
              />
            </FormControl>
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
            <Place
              id="pob"
              isRequired={true}
              placeholder="Birth Place *"
              onAddressChange={handleAddressChange}
              defaultValue={user?.pob ? user?.pob?.formattedAddress || "" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Place
              id="por"
              isRequired={true}
              placeholder="Residence Address *"
              onAddressChange={handleAddressChange}
              defaultValue={user?.por ? user?.por?.formattedAddress || "" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="fixed-upper-label-input" shrink>
                Level *
              </InputLabel>
              <Select
                required
                fullWidth
                id="level"
                label="Level"
                name="level"
                autoComplete="level"
                {...formik.getFieldProps("level")}
                error={formik.touched.level && Boolean(formik.errors.level)}
              >
                <MenuItem value="1">Admin</MenuItem>
                <MenuItem value="2">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              autoComplete="phone"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {user && <em>leave blank to keep same</em>}
          </Grid>
          <br />
          <AddEditPlaces locations={locations} addLocation={addLocation} />
        </Grid>
        <Button
          color="success"
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
        <Link href="/users">Cancel</Link>
      </form>
    </ThemeProvider>
  );
}
