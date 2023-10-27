import { apiHandler, success } from "helpers/api";
import { locationsRepo } from "repos";
export default apiHandler({
  get: getById,
  delete: _delete,
});

async function getById(req, res) {
  const location = await locationsRepo.getById(req.query.id);

  if (!location) throw "location Not Found";

  return res.status(200).json({ ...success, data: location });
}

async function _delete(req, res) {
  await locationsRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
