import { fetchWrapper } from "helpers";
import { userService } from "./user.service";
import { locationsService } from "./locations.service";
import * as moment from "moment";

const baseUrl = `/api/offers`;

export const offersService = {
  getAll,
  create,
  getById,
  getAllById,
  update,
  delete: _delete,
  getAllOffers,
  offerTypes: ["Ad", "Event", "News", "Offer", "Job", "Agriculture Info"],
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
async function getAllOffers() {
  let res = await loadOffersWithLocations();
  let res1 = await loadAllOffers();
  let res2 = [...res, ...res1];
  return [res2.length + " posts found", res2];
}

async function loadAllOffers() {
  // get all offers ids not only of user from location
  let res = await locationsService.getAllByLocations([]);
  if (res && res.success) {
    let offersIds = res?.data || [];
    let today = moment().format("YYYY-MM-DD");
    let filters = { date: today, exclude: { offersIds } };
    let res1 = await getOffersWithFilters(filters);

    if (res1 && res1.success) {
      if (res1.data.length) {
        return res1.data;
      }
    }
  }
  return [];
  /*} else {
        return ["No Offers found", []];
      }*/
  /*} else {
      return ["Error while getting offers", []];
    }*/
  /*} else {
    return ["Error while getting Locations", []];
  }*/
}
async function loadOffersWithLocations() {
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
        let today = moment().format("YYYY-MM-DD");
        let filters = { date: today, include: { offersIds: res2?.data } };
        let offers = await getOffersWithFilters(filters);
        if (offers && offers.success) {
          if (offers?.data.length) {
            return offers?.data;
            //console.log(res, res2, offers);
            /*} else {
              return ["No offers found", []];
            }*/
            /*} else {
              return ["Error while getting offers", []];
            }*/
            /*} else {
              return ["Error while getting offers", []];
            }*/
            /*} else {
              return ["No saved locations found for user", []];
            }*/
            /*} else {
              return ["Error while getting offers", []];
            }*/
          }
        }
      }
    }
  }
  return [];
}
async function getOffersWithFilters(filters) {
  let res = await fetchWrapper.post(`${baseUrl}/filter`, filters);
  return res;
}
