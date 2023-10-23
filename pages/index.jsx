import { relationsService, userService } from "services";
import { Layout } from "../components/users";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default Home;

function Home() {
  let searchedU = [];
  let searchedR = [];
  const processRelations = async (userAId, userBId) => {
    let relations0 = await relationsService.getRelationsIds(userAId);
    let relations1 = await relationsService.getRelationsIds(userBId);

    let relations = [...relations0, ...relations1];
    let r1 = [[...relations]];

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
      const relationsT = await relationsService.getRelationsIds(r);
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
      const relationsT = await relationsService.getRelationsIds(r);
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
      const relationsX = await relationsService.getRelationsIds(r);
      rx.push(relationsX);
      // }
    }
    return rx;
  };
  const test = async () => {
    const userAId = "652fde6119100badee381386";
    const userBId = "6526acb5271463c85f5827fd";

    let res = await processRelations(userAId, userBId);

    const flattenedArray = res
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
    let graph = {};

    filteredData.forEach((relation) => {
      const userId = relation.userId;
      const relatedUserId = relation.relatedUserId;
      const relationDetails = {
        id: relatedUserId,
        createdAt: relation.createdAt,
        updatedAt: relation.updatedAt,
        relationId: relation.relation,
      };

      if (!graph[userId]) {
        graph[userId] = [];
      }

      graph[userId].push({
        id: relatedUserId,
        sf: relationDetails,
      });
      if (!graph[relatedUserId]) {
        graph[relatedUserId] = [];
      }

      graph[relatedUserId].push({
        id: userId,
        sf: relationDetails,
      });
    });

    //console.log(graph);
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

    const deepRelationships =
      findDeepRelationships(graph, userAId, userBId) || [];
    const resultArray = [];
    let found = false;
    for (let i = deepRelationships.length - 1; i >= 0; i--) {
      const item = deepRelationships[i];
      if (item.id === userAId) {
        found = true;
      }
      if (!found) {
        resultArray.unshift(item);
      } else {
        break;
      }
    }

    if (deepRelationships.length > 0) {
      console.log(`Deep relationships between ${userAId} and ${userBId}:`);
      console.log(deepRelationships, resultArray);
    } else {
      console.log(`No relationships found between ${userAId} and ${userBId}.`);
    }
  };

  return (
    <Layout>
      <Typography variant="h6" onClick={test} className="text-center">
        Welcome <br />
        {userService.name}
      </Typography>
    </Layout>
  );
}
