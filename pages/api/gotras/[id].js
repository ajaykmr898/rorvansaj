import { apiHandler, success } from "helpers/api";
import { gotrasRepo } from "repos";
export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const gotra = await gotrasRepo.getById(req.query.id);

  if (!gotra) throw "Gotra Not Found";

  return res.status(200).json({ ...success, data: gotra });
}

async function update(req, res) {
  let gotra = await gotrasRepo.update(req.query.id, req.body);
  return res.status(200).json({ ...success, data: gotra });
}

async function _delete(req, res) {
  await gotrasRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
