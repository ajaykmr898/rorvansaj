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
  //console.log(new Date());
  let x = await findRelationsLoop2([...userRelations1, ...userRelations2], []);
  //console.log(new Date());

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

async function findRelationsLoop2(relations, searchedU) {
  const uniqueUserIds = new Set();

  // Extract all unique user IDs from initial relations
  relations.forEach((r) => {
    uniqueUserIds.add(r.relatedUserId);
    uniqueUserIds.add(r.userId);
  });

  for (let i = 0; i < 3; i++) {
    const newRelations = [];
    const promises = [];

    // Fetch relations for each unique user ID
    uniqueUserIds.forEach((userId) => {
      if (!searchedU.includes(userId)) {
        searchedU.push(userId);
        promises.push(
          relationsRepo.findRelations(userId).then((relations) => {
            newRelations.push(...relations);
          })
        );
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Extract unique user IDs from the new relations and add them to the set
    uniqueUserIds.clear();
    newRelations.forEach((r) => {
      uniqueUserIds.add(r.relatedUserId);
      uniqueUserIds.add(r.userId);
    });
  }

  // Fetch relations for the final set of unique user IDs
  const finalRelations = [];
  const finalPromises = Array.from(uniqueUserIds).map((userId) => {
    if (!searchedU.includes(userId)) {
      searchedU.push(userId);
      return relationsRepo.findRelations(userId).then((relations) => {
        finalRelations.push(...relations);
      });
    }
    return Promise.resolve();
  });

  // Wait for all final promises to resolve
  await Promise.all(finalPromises);

  return finalRelations;
}
