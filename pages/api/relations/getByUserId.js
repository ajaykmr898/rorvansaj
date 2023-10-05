import { apiHandler, success } from "helpers/api";
import { relationsRepo } from "repos";

export default apiHandler({
  post: getByUserId,
  put: deleteByUserId,
});

async function getByUserId(req, res) {
  const userRelations = await relationsRepo.getByUserId(req.body.userId);
  return res.status(200).json({ ...success, data: userRelations });
}

async function deleteByUserId(req, res) {
  await relationsRepo.deleteByUserId(req.body.userId);
  return res.status(200).json({ ...success });
}
