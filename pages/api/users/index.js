import { apiHandler, success } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  post: getAll,
  put: searchByName,
});

async function getAll(req, res) {
  const users = await usersRepo.getAll(req.body);
  return res.status(200).json({ ...success, data: users });
}

async function searchByName(req, res) {
  const users = await usersRepo.searchByName(req.body);
  return res.status(200).json({ ...success, data: users });
}
