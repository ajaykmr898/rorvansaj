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
      const place = await autoCompleteRef?.current?.getPlace();
      const location = place?.geometry?.location;
      const latitude = location?.lat() || "";
      const longitude = location?.lng() || "";
      const placeId = place?.place_id;
      let total = { placeId, latitude, longitude };
      if (place?.address_components) {
        const pac = place?.address_components;
        pac.map((el) => {
          let loc = el?.types.includes("locality");
          let has1 = el?.types.includes("administrative_area_level_1");
          let has2 = el?.types.includes("administrative_area_level_2");
          let has3 = el?.types.includes("administrative_area_level_3");
          let country = el?.types.includes("country");
          let postal = el?.types.includes("postal_code");
          if (postal) {
            total = {
              ...total,
              postalCode: el?.long_name,
            };
          }
          if (loc) {
            total = {
              ...total,
              locationS: el?.short_name,
              location: el?.long_name,
            };
          }
          if (has1) {
            total = {
              ...total,
              regionS: el?.short_name,
              region: el?.long_name,
            };
          }
          if (has2) {
            total = { ...total, provS: el?.short_name, prov: el?.long_name };
          }
          if (has3) {
            total = { ...total, cityS: el?.short_name, city: el?.long_name };
          }
          if (country) {
            total = {
              ...total,
              countryS: el?.short_name,
              country: el?.long_name,
            };
          }
          //console.log(el);
        });
      }

      setPlace(JSON.stringify(total, null, 2));
      //console.log(place, total);
    });
  }, []);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  function calculate() {
    // Example usage
    let lat1 = 29.9548018; // Latitude of the first place
    let lon1 = 76.7931478; // Longitude of the first place
    let lat2 = 29.8853701; // Latitude of the second place
    let lon2 = 76.62105389; // Longitude of the second place

    let distance = calculateDistance(lat1, lon1, lat2, lon2);
    alert(distance.toFixed(2) + " km distance between mirzapur/dhand");
  }

  return (
    <div>
      <button onClick={() => calculate()}>Calculate Distance</button>
      <br />
      <br />
      <label>Location:</label>
      <input className="loc-input" type="text" ref={inputRef} />
      <pre>{place}</pre>
    </div>
  );
}
