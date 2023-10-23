import { fetchWrapper } from "helpers";

const baseUrl = `/api/relations`;

export const relationsService = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
  findRelationships,
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
async function findRelationships(userId1, userId2) {
  // get graph
  let graph = await fetchWrapper.put(`${baseUrl}/getRelations`, {
    userId1,
    userId2,
  });
  // get relations by recursion
  const deepRelationships =
    findDeepRelationships(graph, userId1, userId2) || [];
  const paths = [];
  let found = false;
  for (let i = deepRelationships.length - 1; i >= 0; i--) {
    const item = deepRelationships[i];
    if (item.id === userId1) {
      found = true;
    }
    if (!found) {
      paths.unshift(item);
    } else {
      break;
    }
  }
  return paths;
}

function findDeepRelationships(graph, startUser, endUser) {
  function dfs(node, path) {
    if (node.id === endUser) {
      return path.concat(node);
    }

    visited.add(node.id);

    for (const neighbor of graph[node.id] || []) {
      if (!visited.has(neighbor.id)) {
        const result = dfs(neighbor, path.concat(node));
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  const visited = new Set();
  const startNode = graph[startUser];

  if (startNode) {
    return dfs(startNode[0], []);
  }

  return [];
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
