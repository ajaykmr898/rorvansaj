import { apiHandler } from "helpers/api";
import { relationsRepo } from "repos";

export default apiHandler({
  post: add,
  get: getAll,
});

async function getAll(req, res) {
  const relations = await relationsRepo.getAll();
  return res.status(200).json(relations);
}
async function add(req, res) {
  let relation = await relationsRepo.create(req.body);
  return res.status(200).json(relation);
}
