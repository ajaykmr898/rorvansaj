import { apiHandler, success } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  post: getByRegLink,
  put: updateUser,
});

async function getByRegLink(req, res) {
  const user = await usersRepo.getByRegLink(req.body);
  return res.status(200).json({ ...success, data: user });
}

async function updateUser(req, res) {
  await usersRepo.update(req.body.id, req.body);
  return res.status(200).json({ ...success });
}
