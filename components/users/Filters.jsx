import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { Place } from "../maps";

const validationSchema = Yup.object({
  name: Yup.string(),
  dob: Yup.date(),
  pos: Yup.string(),
  gender: Yup.string(),
});
export { Filters };
function Filters({ search }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [place, setPlace] = useState({});
  const [address, setAddress] = useState("");

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      dob: "",
      pos: "",
      gender: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {},
  });

  const onSubmit = () => {
    const values = formik.values;
    values.pos = place;
    search(values);
  };

  const reset = () => {
    formik.resetForm();
    setAddress("");
    search({});
  };

  const handleAddressChange = (newAddress, id) => {
    setPlace(newAddress);
    //console.log(id, newAddress);
  };

  return (
    <Card>
      <div className="cardToggle">
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        <IconButton onClick={handleToggleExpand}>
          {isExpanded ? <CloseIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {isExpanded && (
        <CardContent>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  label="Name"
                  fullWidth
                  variant="outlined"
                  {...formik.getFieldProps("name")}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="fixed-upper-label-input" shrink>
                    Date of birth
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="dob"
                    label="Date of birth"
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
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="fixed-upper-label-input" shrink>
                    Gender
                  </InputLabel>
                  <Select
                    fullWidth
                    id="gender"
                    label="Gender"
                    name="gender"
                    autoComplete="gender"
                    {...formik.getFieldProps("gender")}
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Place
                  id="pos"
                  placeholder="Place"
                  onAddressChange={handleAddressChange}
                  isRequired={false}
                  defaultValue={address}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                  <Button
                    onClick={() => reset()}
                    variant="contained"
                    color="secondary"
                  >
                    Reset
                  </Button>
                  &nbsp;
                  <Button
                    onClick={() => onSubmit()}
                    variant="contained"
                    color="primary"
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
