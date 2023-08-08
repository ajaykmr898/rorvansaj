import { apiHandler } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  post: getByRegLink,
});

async function getByRegLink(req, res) {
  const user = await usersRepo.getByRegLink(req.body);
  return res.status(200).json(user);
}
