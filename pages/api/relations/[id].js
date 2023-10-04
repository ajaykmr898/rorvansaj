import { apiHandler, success } from "helpers/api";
import { relationsRepo } from "repos";
export default apiHandler({
  delete: _delete,
});

async function _delete(req, res) {
  await relationsRepo.delete(req.query.id);
  return res.status(200).json({ ...success });
}
