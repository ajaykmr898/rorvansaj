import { apiHandler, success } from "helpers/api";
import { usersRepo } from "repos";
export default apiHandler({
  get: getById,
  put: update,
  delete: _delete,
});

async function getById(req, res) {
  const user = await usersRepo.getById(req.query.id);

  if (!user) throw "User Not Found";

  return res.status(200).json({ ...success, data: user });
}

async function update(req, res) {
  await usersRepo.update(req.query.id, req.body);
  return res.status(200).json({ ...success });
}

async function _delete(req, res) {
  await usersRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
