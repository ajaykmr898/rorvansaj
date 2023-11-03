import { apiHandler, success } from "helpers/api";
import { marriagesRepo } from "repos";

export default apiHandler({
  post: add,
  get: getAll,
});

async function getAll(req, res) {
  const marriages = await marriagesRepo.getAll();
  return res.status(200).json({ ...success, data: marriages });
}
async function add(req, res) {
  let marriage = await marriagesRepo.create(req.body);
  return res.status(200).json({ ...success, data: marriage });
}
