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
    if (item === userId1) {
      found = true;
    }

    let x = await getByUserId(item);
    paths.unshift({ id: item, relations: x?.data || [] });
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
        let label2 = "";
        if (id === r.relatedUserId.id) {
          label = `${r.relatedUserId.firstName} ${r.relatedUserId.lastName} - ${r.relatedUserId.phone} - ${r.relatedUserId.email}`;
          label2 = r.relation.relation;
        }
        if (id === r.userId.id) {
          label = `${r.userId.firstName} ${r.userId.lastName} - ${r.userId.phone} - ${r.userId.email}`;
          label2 = r.relation.counterRelation;
        }
        let el = { data: { id: "node", label } };
        let el2 = {
          data: {
            id: "edge",
            label: label2,
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

function findDeepRelationships(graph, start, end) {
  const queue = [{ node: start, path: [start] }];
  const visited = new Set();

  while (queue.length > 0) {
    const { node, path } = queue.shift();

    if (node === end) {
      return path;
    }

    if (!visited.has(node)) {
      visited.add(node);

      if (graph[node]) {
        for (const neighbor of graph[node]) {
          if (!visited.has(neighbor.id)) {
            queue.push({ node: neighbor.id, path: [...path, neighbor.id] });
          }
        }
      }
    }
  }

  return null;
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
