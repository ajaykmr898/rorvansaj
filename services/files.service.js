import { fetchWrapper } from "helpers";

const baseUrl = `/api/files`;

export const filesService = {
  getAllByOfferId,
  create,
  getById,
  delete: _delete,
};

async function getAllByOfferId(id) {
  let res = await fetchWrapper.post(baseUrl, { offerId: id });
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
