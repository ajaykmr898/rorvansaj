import { apiHandler, success } from "helpers/api";
import { gotrasRepo } from "repos";

export default apiHandler({
  post: add,
  get: getAll,
});

async function getAll(req, res) {
  const gotras = await gotrasRepo.getAll();
  return res.status(200).json({ ...success, data: gotras });
}
async function add(req, res) {
  let gotra = await gotrasRepo.create(req.body);
  return res.status(200).json({ ...success, data: gotra });
}
