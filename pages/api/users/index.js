import { apiHandler } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  get: getAll,
});

async function getAll(req, res) {
  const users = await usersRepo.getAll();
  return res.status(200).json(users);
}
