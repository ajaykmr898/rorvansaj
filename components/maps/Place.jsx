import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { userService } from "services";
import TextField from "@mui/material/TextField";
import * as React from "react";

export { Place };

function Place({ children }) {
  const [place, setPlace] = useState("");

  const router = useRouter();
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = { types: ["(cities)"] };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      let total = {};
      if (place?.address_components) {
        let pac = place?.address_components;
        pac.map((el) => {
          let has1 = el.types.includes("administrative_area_level_1");
          let has2 = el.types.includes("administrative_area_level_2");
          let has3 = el.types.includes("administrative_area_level_3");
          let country = el.types.includes("country");
          if (has1) {
            total = { ...total, regionS: el.short_name, region: el.long_name };
          }
          if (has2) {
            total = { ...total, provS: el.short_name, prov: el.long_name };
          }
          if (has3) {
            total = { ...total, cityS: el.short_name, city: el.long_name };
          }
          if (country) {
            total = {
              ...total,
              countryS: el.short_name,
              country: el.long_name,
            };
          }
          //console.log(el);
        });
      }

      setPlace(JSON.stringify(total, null, 2));
      console.log(place, total);
    });
  }, []);

  return (
    <div>
      <label>Location:</label>
      <input className="loc-input" type="text" ref={inputRef} />
      <pre>{place}</pre>
    </div>
  );
}
