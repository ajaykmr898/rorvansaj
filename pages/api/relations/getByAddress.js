import { apiHandler, success } from "helpers/api";
import { relationsRepo } from "repos";

export default apiHandler({
  post: getByAddress,
});

async function getByAddress(req, res) {
  const result = await relationsRepo.getByAddress(req.body.address);
  return res.status(200).json({ ...success, data: result });
}
