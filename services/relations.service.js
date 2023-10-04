import { fetchWrapper } from "helpers";
const baseUrl = `/api/relations`;

export const relationsService = {
  relations: [
    { value: "0", label: "Father" },
    { value: "1", label: "Mother" },
    { value: "2", label: "Brother" },
    { value: "3", label: "Sister" },
    { value: "4", label: "Cousin" },
    { value: "5", label: "Son" },
    { value: "6", label: "Daughter" },
    { value: "7", label: "Grand Father" },
    { value: "8", label: "Grand Mother" },
    { value: "9", label: "Grandson" },
    { value: "10", label: "Granddaughter" },
    { value: "11", label: "Uncle" },
    { value: "12", label: "Aunt" },
    { value: "13", label: "Husband" },
    { value: "14", label: "Wife" },
    { value: "15", label: "Mother-in-law" },
    { value: "16", label: "Father-in-law" },
    { value: "17", label: "Brother-in-law" },
    { value: "18", label: "Sister-in-law" },
    { value: "19", label: "Friend" },
  ],
  getAll,
  getByUserId,
  create,
  delete: _delete,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getByUserId(params) {
  return await fetchWrapper.post(`${baseUrl}/getByUserId`, params);
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}
