import { fetchWrapper } from "helpers";

const baseUrl = `/api/gotras`;

export const gotrasService = {
  getAllByVillageId,
  create,
  getById,
  delete: _delete,
  getAll,
  update,
};

async function getAll() {
  let res = await fetchWrapper.get(baseUrl);
  res.data = res?.data.map((gotra) => ({
    ...gotra,
  }));
  return res;
  //return { data: { gotras: [{ idd: "1", firstName: "a", lastName: "s" }] } };
}

async function getAllByVillageId(id) {
  let res = await fetchWrapper.put(baseUrl, { villageId: id });
  return res;
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
