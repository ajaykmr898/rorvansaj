import { fetchWrapper } from "helpers";
import { userService } from "./user.service";
import { locationsService } from "./locations.service";

const baseUrl = `/api/offers`;

export const offersService = {
  getAll,
  create,
  getById,
  getAllById,
  update,
  delete: _delete,
  loadOffers,
  offerTypes: ["Ad", "News", "Offer", "Job", "Agriculture Info"],
  offer(type) {
    return offersService.offerTypes[type] || "";
  },
};

async function getAll() {
  let res = await fetchWrapper.get(baseUrl);
  res.data = res?.data.map((offer) => ({
    ...offer,
    visibility: offer?.visibility?.formattedAddress || "",
    user: `${offer?.userId?.firstName} ${offer?.userId?.lastName}` || "",
    type: offersService.offer(offer?.types) || "",
  }));
  return res;
  //return { data: { offers: [{ idd: "1", firstName: "a", lastName: "s" }] } };
}

async function getAllById(params) {
  let res = await fetchWrapper.put(baseUrl, params);
  res.data = res?.data.map((offer) => ({
    ...offer,
    visibility: offer?.visibility?.formattedAddress || "",
    user: `${offer?.userId?.firstName} ${offer?.userId?.lastName}` || "",
    type: offersService.offer(offer?.types) || "",
  }));
  return res;
  //return { data: { offers: [{ idd: "1", firstName: "a", lastName: "s" }] } };
}
async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

async function update(id, params) {
  return await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}

async function loadOffers() {
  let id = userService?.userValue.id;
  //id = "65280bc90adeb1a81711ddfc";
  let res = await locationsService.getAllByUserOfferId(id, "user");

  if (res && res.success) {
    let places = (res?.data || []).map((x) => {
      return x.location.placeId;
    });
    if (places.length) {
      let res2 = await locationsService.getAllByLocations(places);
      if (res2 && res2.success) {
        let offers = await offersService.getAllById(res2?.data);
        if (offers && offers.success) {
          if (offers?.data.length) {
            return [offers?.data.length + " offers found", offers?.data];
            //console.log(res, res2, offers);
          } else {
            return ["No offers found", []];
          }
        } else {
          return ["Error while getting offers", []];
        }
      } else {
        return ["Error while getting offers", []];
      }
    } else {
      return ["No saved locations found for user", []];
    }
  } else {
    return ["Error while getting offers", []];
  }
}
