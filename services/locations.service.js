import { fetchWrapper } from "helpers";

const baseUrl = `/api/locations`;

export const locationsService = {
  getAllByUserOfferId,
  create,
  getById,
  getAllByLocations,
  delete: _delete,
};

async function getAllByUserOfferId(id, type) {
  let res = await fetchWrapper.post(
    baseUrl,
    type === "user" ? { userId: id, type } : { offerId: id, type }
  );
  return res;
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function create(params) {
  return await fetchWrapper.put(baseUrl, params);
}

async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}

async function getAllByLocations(params) {
  return await fetchWrapper.post(`${baseUrl}/getAllByLocations`, params);
}
