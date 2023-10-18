import { apiHandler, success } from "helpers/api";
import { filesRepo } from "repos";
export default apiHandler({
  get: getById,
  delete: _delete,
});

async function getById(req, res) {
  const file = await filesRepo.getById(req.query.id);

  if (!file) throw "file Not Found";

  return res.status(200).json({ ...success, data: file });
}

async function _delete(req, res) {
  await filesRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
