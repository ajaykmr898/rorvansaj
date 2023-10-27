import { fetchWrapper } from "helpers";

const baseUrl = `/api/locations`;

export const locationsService = {
  getAllByUserId,
  create,
  getById,
  delete: _delete,
};

async function getAllByUserId(id) {
  let res = await fetchWrapper.post(baseUrl, { userId: id });
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
