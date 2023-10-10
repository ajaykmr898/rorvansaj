import { fetchWrapper } from "helpers";

const baseUrl = `/api/relations`;

export const relationsService = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
  findRelations,
  getRelationsIds,
};

async function getAll() {
  return await fetchWrapper.get(baseUrl);
}

async function getByUserId(userId) {
  const temp = await fetchWrapper.post(`${baseUrl}/getByUserId`, { userId });
  const res = [temp.data].map((t) => {
    return t.map((tt) => {
      //console.log(userId, tt?.relatedUserId?.id);
      return {
        ...tt,
        primary: tt?.relatedUserId?.id !== userId ? "relatedUserId" : "userId",
      };
    });
  });
  //return temp;
  return { ...temp, data: res.length ? res[0] : [] };
}

async function getRelationsIds(userId) {
  const temp = await fetchWrapper.post(`${baseUrl}/getRelations`, {
    userId,
  });
  return [...temp];
}
async function findRelations(userId1, userId2) {
  let output = "No relation found";
  let firstNodes = await Promise.all([
    getRelationsIds(userId1),
    getRelationsIds(userId2),
  ]);

  let ids = [];
  [...firstNodes[0], ...firstNodes[1]].forEach((node) => {
    ids.push(node.relatedUserId, node.userId);
  });

  let ids2 = [...new Set([...ids])];
  let found = ids.includes(userId1) && ids2.includes(userId2);
  if (found) {
    output = "Relation found, but error while retriving";
    let res = await getByUserId(userId1);
    if (res?.data.length) {
      let rel = [...res?.data].filter((rr) => {
        return (
          (rr.relatedUserId.id === userId1 && rr.userId.id === userId2) ||
          (rr.relatedUserId.id === userId2 && rr.userId.id === userId1)
        );
      });

      if (rel.length) {
        let r = rel[0];
        let userA = r.primary === "relatedUserId" ? r.relatedUserId : r.userId;
        let userB = r.primary !== "relatedUserId" ? r.relatedUserId : r.userId;
        let label =
          r.primary === "relatedUserId"
            ? r.relation?.relation
            : r.relation?.counterRelation;
        output = `${userA.firstName} ${userA.lastName} is ${label} of ${userB.firstName} ${userB.lastName}`;
      }
    }
  }
  return output;
}

function mergeArraysAndRemoveDuplicates(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
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
