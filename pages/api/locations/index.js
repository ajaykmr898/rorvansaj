import { apiHandler, success } from "helpers/api";
import { locationsRepo } from "repos";

export default apiHandler({
  put: add,
  post: getAllByUserOfferId,
});

async function getAllByUserOfferId(req, res) {
  let locations = [];
  if (req.body.type === "user") {
    locations = await locationsRepo.getAllByUserId(req.body.userId);
  } else {
    locations = await locationsRepo.getAllByOfferId(req.body.offerId);
  }
  return res.status(200).json({ ...success, data: locations });
}
async function add(req, res) {
  let location = await locationsRepo.create(req.body);
  return res.status(200).json({ ...success, data: location });
}
