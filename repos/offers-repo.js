import { db } from "helpers/api";

const Offers = db.Offers;
export const offersRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getById(id) {
  return await Offers.findById(id);
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
  await Offers.findByIdAndRemove(id);
}
