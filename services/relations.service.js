import { fetchWrapper } from "helpers";
const baseUrl = `/api/relations`;

export const relationsService = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getByUserId(userId) {
  return await fetchWrapper.post(`${baseUrl}/getByUserId`, { userId });
}

async function deleteByUserId(userId) {
  return await fetchWrapper.put(`${baseUrl}/getByUserId`, { userId });
}

async function create(params) {
  return await fetchWrapper.post(baseUrl, params);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  await fetchWrapper.delete(`${baseUrl}/${id}`);
}
