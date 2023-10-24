import { apiHandler, success } from "helpers/api";
import { relationsRepo } from "repos";
import { relationsService } from "../../../services";

export default apiHandler({
  put: graphRelations,
});

async function graphRelations(req, res) {
  let graph = {};
  const userRelations1 = await relationsRepo.findRelations(req.body.userId1);
  const userRelations2 = await relationsRepo.findRelations(req.body.userId2);

  let x = await findRelationsLoop([...userRelations1, ...userRelations2], []);

  const flattenedArray = x
    .flat()
    .filter((item) => item !== null && item !== undefined);
  //console.log(flattenedArray);

  const uniqueCombinations = {};
  const filteredData = flattenedArray.filter((item) => {
    const key = `${item.userId}-${item.relatedUserId}`;
    if (!uniqueCombinations[key]) {
      uniqueCombinations[key] = true;
      return true;
    }
    return false;
  });
  //console.log(filteredData);

  filteredData.forEach((relation) => {
    const userId = relation.userId;
    const relatedUserId = relation.relatedUserId;

    if (!graph[userId]) {
      graph[userId] = [];
    }

    graph[userId].push({
      id: relatedUserId,
    });
    if (!graph[relatedUserId]) {
      graph[relatedUserId] = [];
    }

    graph[relatedUserId].push({
      id: userId,
    });
  });

  return res.status(200).json(graph);
}

async function findRelationsLoop(relations, searchedU) {
  // get all 1st relations
  let all1LevelIds = [];
  relations.map((r) => {
    all1LevelIds.push(r.relatedUserId, r.userId);
  });
  //remove duplicates and initial 2 users
  all1LevelIds = [...new Set([...all1LevelIds])];

  let relations2 = [];
  for (const r of all1LevelIds) {
    //if (r && !searchedU.includes(r)) {
    searchedU.push(r);
    const relationsT = await relationsRepo.findRelations(r);
    relations2.push(relationsT);
    // }
  }
  let all2LevelIds = [];
  relations2.map((r) => {
    r.map((r2) => {
      all2LevelIds.push(r2.relatedUserId, r2.userId);
    });
  });
  //remove duplicates and initial 2 users
  all2LevelIds = [...new Set([...all2LevelIds])];

  let relations3 = [];
  for (const r of all2LevelIds) {
    //if (r && !searchedU.includes(r)) {
    searchedU.push(r);
    const relationsT = await relationsRepo.findRelations(r);
    relations3.push(relationsT);
    //}
  }
  let all3LevelIds = [];
  relations3.map((r) => {
    r.map((r2) => {
      all3LevelIds.push(r2.relatedUserId, r2.userId);
    });
  });
  //remove duplicates and initial 2 users
  all3LevelIds = [...new Set([...all3LevelIds])];

  let rx = [];
  for (const r of all3LevelIds) {
    //if (r && !searchedU.includes(r)) {
    searchedU.push(r);
    const relationsX = await relationsRepo.findRelations(r);
    rx.push(relationsX);
    // }
  }
  return rx;
}
