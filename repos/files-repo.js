import { db } from "helpers/api";

const Files = db.Files;
export const filesRepo = {
  getAllByOfferId,
  getById,
  create,
  delete: _delete,
};

async function getAllByOfferId(offerId) {
  return await Files.find({ offerId, deleted: "false" })
    .populate("offerId")
    .exec();
}

async function getById() {
  return await Files.find({}).populate("offerId").exec();
}

async function create(params) {
  const file = new Files(params);
  try {
    return await file.save();
  } catch (err) {
    throw "An error occurred while saving file, retry" + err;
  }
}

async function _delete(id) {
  const updated = await Files.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: "true" } },
    { new: true }
  );
}
