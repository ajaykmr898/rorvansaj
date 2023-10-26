import { db } from "helpers/api";

const UserRelations = db.UserRelations;
const Relations = db.Relations;
const User = db.User;
export const relationsRepo = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
  findRelations,
  getByAddress,
};

async function getByAddress(address) {
  let res = User.find({
    $or: [
      { "pob.placeId": address?.placeId },
      { "por.placeId": address?.placeId },
    ],
  }).limit(100);
  return res;
}

async function getByUserId(userId) {
  return await UserRelations.find({
    $or: [{ userId: userId }, { relatedUserId: userId }],
  })
    .populate("relatedUserId") // Populate the related user data
    .populate("relation")
    .populate("userId")
    .exec();
}

async function findRelations(userId) {
  return await UserRelations.find({
    $or: [{ userId: userId }, { relatedUserId: userId }],
  }).exec();
}
async function getAll() {
  return await Relations.find();
}

async function create(params) {
  const temp = await UserRelations.findOne({
    relatedUserId: params.relatedUserId,
    userId: params.userId,
  });
  if (temp) {
    throw "These people have already a relation saved";
  }

  const relation = new UserRelations(params);
  try {
    return await relation.save();
  } catch (err) {
    throw "An error occurred while saving relation, retry";
  }
}
async function _delete(id) {
  await UserRelations.findByIdAndRemove(id);
}

async function deleteByUserId(userId) {
  return await UserRelations.deleteMany({
    $or: [{ userId: userId }, { relatedUserId: userId }],
  });
}
