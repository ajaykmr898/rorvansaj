import { apiHandler, success } from "helpers/api";
import { chartsRepo } from "repos";

export default apiHandler({
  post: add,
  get: getAll,
});

async function getAll(req, res) {
  const data = await chartsRepo.getAll();
  return res.status(200).json({ ...success, data: data });
}
async function add(req, res) {
  let chart = await chartsRepo.create(req.body);
  return res.status(200).json({ ...success, data: chart });
}
