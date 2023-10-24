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
async function findRelationships(userId1, userId2, label) {
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

    let x = await getByUserId(item.id);
    paths.unshift({ ...item, relations: x?.data || [] });
    if (found) {
      break;
    }
  }

  let res = [];
  //paths.length &&
  //paths.push({ id: userId2, relations: paths[paths.length - 1]?.relations });
  for (let i = 0; i < paths.length; i++) {
    //if (i !== paths.length - 1) {
    let id = paths[i].id;
    let idn = typeof paths[i + 1] !== "undefined" ? paths[i + 1].id : null;
    let relations = paths[i].relations;
    let rr = relations.map((r, idx) => {
      //check if id not present
      if ([r?.relatedUserId?.id, r?.userId?.id].includes(idn)) {
        let label = "";
        if (id === r.relatedUserId.id) {
          label = `${r.relatedUserId.firstName} ${r.relatedUserId.lastName} - ${r.relatedUserId.phone} - ${r.relatedUserId.email}`;
        }
        if (id === r.userId.id) {
          label = `${r.userId.firstName} ${r.userId.lastName} - ${r.userId.phone} - ${r.userId.email}`;
        }
        let el = { data: { id: "node", label } };
        let el2 = {
          data: {
            id: "edge",
            label: r.relation.relation,
            //target: "node" + idx + "_" + (i + 1),
            //source: "node" + idx + "_" + i,
          },
        };
        res.push(el, el2);
      }
    });
    //}
  }

  let x = res.map((r, i) => {
    console.log(r);
    if (r.data.id === "node") {
      return { data: { ...r.data, id: "node" + i } };
    }
    if (r.data.id === "edge") {
      return {
        data: {
          ...r.data,
          id: "edge" + (i - 1),
          target: "node" + (i + 1),
          source: "node" + (i - 1),
        },
      };
    }
  });

  if (x.length) {
    x.push({ data: { id: "node" + x.length, label: label } });
  }

  console.log(x, res, paths);
  return x;
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
