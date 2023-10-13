import { db } from "helpers/api";

const Offers = db.Offers;
export const offersRepo = {
  getAll,
  create,
  delete: _delete,
};

async function getAll() {
  return await Offers.find();
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
    throw "An error occurred while saving relation, retry";
  }
}
async function _delete(id) {
  await Offers.findByIdAndRemove(id);
}
