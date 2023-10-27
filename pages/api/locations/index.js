import { apiHandler, success } from "helpers/api";
import { locationsRepo } from "repos";

export default apiHandler({
  put: add,
  post: getAllByUserId,
});

async function getAllByUserId(req, res) {
  const locations = await locationsRepo.getAllByUserId(req.body.userId);
  return res.status(200).json({ ...success, data: locations });
}
async function add(req, res) {
  let location = await locationsRepo.create(req.body);
  return res.status(200).json({ ...success, data: location });
}
