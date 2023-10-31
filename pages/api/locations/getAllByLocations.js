import { apiHandler, success } from "helpers/api";
import { locationsRepo } from "repos";

export default apiHandler({
  post: getAllByLocations,
});

async function getAllByLocations(req, res) {
  let res1 = await locationsRepo.getAllByLocations(req.body);
  return res.status(200).json({ ...success, data: res1 });
}
