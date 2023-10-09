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
  const temp = await fetchWrapper.post(`${baseUrl}/getByUserId`, { userId });
  const res = [temp.data].map((t) => {
    return t.map((tt) => {
      console.log(userId, tt?.relatedUserId?.id);
      return {
        ...tt,
        primary: tt?.relatedUserId?.id !== userId ? "relatedUserId" : "userId",
      };
    });
  });
  //return temp;
  return { ...temp, data: res.length ? res[0] : [] };
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
