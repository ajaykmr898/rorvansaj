import { apiHandler, success } from "helpers/api";
import { filesRepo } from "repos";

export default apiHandler({
  put: add,
  post: getAllByOfferId,
});

async function getAllByOfferId(req, res) {
  const files = await filesRepo.getAllByOfferId(req.body.offerId);
  return res.status(200).json({ ...success, data: files });
}
async function add(req, res) {
  let file = await filesRepo.create(req.body);
  return res.status(200).json({ ...success, data: file });
}
