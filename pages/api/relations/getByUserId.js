import { apiHandler } from "helpers/api";
import { relationsRepo } from "repos";

export default apiHandler({
  post: getByUserId,
});

async function getByUserId(req, res) {
  const userRelations = await relationsRepo.getByUserId(req.userId);
  return res.status(200).json(userRelations);
}
