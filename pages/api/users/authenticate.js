import { apiHandler, success } from "helpers/api";
import { usersRepo } from "repos";

export default apiHandler({
  post: authenticate,
});

async function authenticate(req, res) {
  const user = await usersRepo.authenticate(req.body);
  return res.status(200).json({ ...success, data: user });
}
