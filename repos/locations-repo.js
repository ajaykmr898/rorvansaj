import { db } from "helpers/api";

const Locations = db.Locations;
export const locationsRepo = {
  getAllByUserId,
  getAllByOfferId,
  getAllByLocations,
  getById,
  create,
  delete: _delete,
};

async function getAllByLocations(filters) {
  return await Locations.distinct("offerId", {
    "location.placeId": { $in: filters },
    deleted: "false",
  });
}
async function getAllByUserId(userId) {
  return await Locations.find({ userId, deleted: "false" });
}
async function getAllByOfferId(offerId) {
  return await Locations.find({ offerId, deleted: "false" });
}

async function getById() {
  return await Locations.find({}).populate("userId").exec();
}

async function create(params) {
  const location = new Locations(params);
  try {
    return await location.save();
  } catch (err) {
    throw "An error occurred while saving location, retry" + err;
  }
}

async function _delete(id) {
  const updated = await Locations.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: "true" } },
    { new: true }
  );
}
