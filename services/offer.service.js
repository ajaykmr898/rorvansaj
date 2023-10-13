import { fetchWrapper } from "helpers";

const baseUrl = `/api/offers`;

export const offersService = {
  getAll,
  create,
  getById,
  update,
  delete: _delete,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
  //return { data: { offers: [{ idd: "1", firstName: "a", lastName: "s" }] } };
}

async function getById(id) {
  return await fetchWrapper.get(`${baseUrl}/${id}`);
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

async function update(id, params) {
  await fetchWrapper.put(`${baseUrl}/${id}`, params);
}

async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}
