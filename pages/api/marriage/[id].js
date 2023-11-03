import { apiHandler, success } from "helpers/api";
import { marriagesRepo } from "repos";
export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const marriage = await marriagesRepo.getById(req.query.id);

  if (!marriage) throw "Marriage Not Found";

  return res.status(200).json({ ...success, data: marriage });
}

async function update(req, res) {
  let marriage = await marriagesRepo.update(req.query.id, req.body);
  return res.status(200).json({ ...success, data: marriage });
}

async function _delete(req, res) {
  await marriagesRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
