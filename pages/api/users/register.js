import { apiHandler } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  post: register,
});

async function register(req, res) {
  await usersRepo.create(req.body);
  return res.status(200).json({});
}
