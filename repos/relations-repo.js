import { db } from "helpers/api";

const UserRelations = db.UserRelations;
const Relations = db.Relations;
export const relationsRepo = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
  findRelations,
};

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
  // @todo check if already present
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
