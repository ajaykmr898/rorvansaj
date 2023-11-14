import { db } from "helpers/api";

const Offers = db.Offers;
export const offersRepo = {
  getAll,
  getAllById,
  getById,
  create,
  update,
  delete: _delete,
  getOffers,
};
async function getOffers(filters) {
  let filter = { deleted: "false" };
  if (filters.include) {
    filter = {
      ...filter,
      _id: { $in: filters.include.offersIds },
    };
  }
  if (filters.exclude) {
    filter = {
      ...filter,
      _id: { $nin: filters.exclude.offersIds },
    };
  }
  if (filters.date) {
    filter = {
      ...filter,
      $and: [{ from: { $lte: filters.date } }, { to: { $gte: filters.date } }],
    };
  }
  if (filters.types) {
    filter = { ...filter, type: { $in: filters.types } };
  }
  //console.log(filter);
  return await Offers.find(filter);
}

async function getById(id) {
  return await Offers.findById(id);
}

async function getAllById(params) {
  return await Offers.find({ _id: { $in: params } });
}

async function getAll() {
  return await Offers.find({}).populate("userId").exec();
}

async function create(params) {
  const temp = await Offers.findOne({
    title: params.title,
  });
  if (temp) {
    throw "There is already an offer saved with that name";
  }
  const offer = new Offers(params);
  try {
    return await offer.save();
  } catch (err) {
    throw "An error occurred while saving offer, retry" + err;
  }
}

async function update(id, params) {
  const offer = await Offers.findById(id);
  if (!offer) throw "Offer not found";
  Object.assign(offer, params);
  return await offer.save();
}

async function _delete(id) {
  const updated = await Offers.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: "true" } },
    { new: true }
  );
}
