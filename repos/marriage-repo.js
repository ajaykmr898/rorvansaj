import { db } from "helpers/api";

const Marriages = db.MarriageRequests;
export const marriagesRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getById(id) {
  return await Marriages.findById(id);
}

async function getAll() {
  return await Marriages.find({}).populate("userId").exec();
}

async function create(params) {
  const marriage = new Marriages(params);
  try {
    return await marriage.save();
  } catch (err) {
    throw "An error occurred while saving marriage, retry" + err;
  }
}

async function update(id, params) {
  const marriage = await Marriages.findById(id);
  if (!marriage) throw "Marriage not found";
  Object.assign(marriage, params);
  return await marriage.save();
}

async function _delete(id) {
  const updated = await Marriages.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: "true" } },
    { new: true }
  );
}
