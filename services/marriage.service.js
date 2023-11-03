import { fetchWrapper } from "helpers";
const baseUrl = `/api/marriage`;

export const marriagesService = {
  getAll,
  create,
  getById,
  update,
  delete: _delete,
};

async function getAll() {
  let res = await fetchWrapper.get(baseUrl);
  res.data = res?.data.map((marriage) => ({
    ...marriage,
    address: marriage?.address?.formattedAddress || "",
    user: `${marriage?.userId?.firstName} ${marriage?.userId?.lastName}` || "",
  }));
  return res;
  //return { data: { marriages: [{ idd: "1", firstName: "a", lastName: "s" }] } };
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
