import { apiHandler, success } from "helpers/api";
import { offersRepo } from "repos";
export default apiHandler({
  delete: _delete,
});

async function _delete(req, res) {
  await offersRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
