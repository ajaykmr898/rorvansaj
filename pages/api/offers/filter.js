import { apiHandler, success } from "helpers/api";
import { offersRepo } from "repos";

export default apiHandler({
  post: getOffers,
});

async function getOffers(req, res) {
  let offer = await offersRepo.getOffers(req.body);
  return res.status(200).json({ ...success, data: offer });
}
