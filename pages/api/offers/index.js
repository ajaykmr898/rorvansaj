import { apiHandler, success } from "helpers/api";
import { offersRepo } from "repos";

export default apiHandler({
  post: add,
  get: getAll,
  put: getAllById,
});

async function getAll(req, res) {
  const offers = await offersRepo.getAll();
  return res.status(200).json({ ...success, data: offers });
}
async function add(req, res) {
  let offer = await offersRepo.create(req.body);
  return res.status(200).json({ ...success, data: offer });
}

async function getAllById(req, res) {
  const offers = await offersRepo.getAllById(req.body);
  return res.status(200).json({ ...success, data: offers });
}
