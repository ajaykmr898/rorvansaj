import { apiHandler, success } from "helpers/api";
import { offersRepo, usersRepo } from "repos";
export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const offer = await offersRepo.getById(req.query.id);

  if (!offer) throw "Offer Not Found";

  return res.status(200).json({ ...success, data: offer });
}

async function update(req, res) {
  let offer = await offersRepo.update(req.query.id, req.body);
  return res.status(200).json({ ...success, data: offer });
}

async function _delete(req, res) {
  await offersRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
