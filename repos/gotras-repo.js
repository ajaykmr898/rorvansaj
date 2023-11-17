import { db } from "helpers/api";

const Gotras = db.Gotras;
export const gotrasRepo = {
  getAllByVillageId,
  getById,
  create,
  delete: _delete,
  getAll,
  update,
};

async function getAllByVillageId(offerId) {
  return await Gotras.find({ offerId, deleted: "false" })
    .populate("offerId")
    .exec();
}

async function getAll() {
  return await Gotras.find({ deleted: "false" });
}

async function getById(id) {
  return await Gotras.findById(id);
}

async function create(params) {
  if (await Gotras.findOne({ name: params.name })) {
    throw 'Gotra "' + params.name + '" is not available';
  }
  const gotra = new Gotras(params);
  try {
    return await gotra.save();
  } catch (err) {
    throw "An error occurred while saving gotra, retry" + err;
  }
}
async function update(id, params) {
  const gotra = await Gotras.findById(id);
  if (!gotra) throw "Gotra not found";
  Object.assign(gotra, params);
  return await gotra.save();
}

async function _delete(id) {
  const updated = await Gotras.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: "true" } },
    { new: true }
  );
}
