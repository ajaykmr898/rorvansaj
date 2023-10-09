import { apiHandler, success } from "helpers/api";
import { relationsRepo } from "repos";

export default apiHandler({
  post: findRelations,
});

async function findRelations(req, res) {
  const userRelations = await relationsRepo.findRelations(req.body.userId);
  return res.status(200).json(userRelations);
}
