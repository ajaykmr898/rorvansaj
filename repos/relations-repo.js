import { db } from "helpers/api";

const UserRelations = db.UserRelations;
const Relations = db.Relations;
export const relationsRepo = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
  deleteByUserId,
};

async function getByUserId(userId) {
  /*let query = [
    {
      $match: {
        $and: [
          {
            userId: userId,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "relatedUserId",
        foreignField: "_id",
        as: "user",
      },
    },
  ];
  //return await UserRelations.aggregate(query);
  return await UserRelations.find({ userId: userId });*/
  return await UserRelations.find({ userId: userId })
    .populate("relatedUserId") // Populate the related user data
    .populate("relation")
    .exec();
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
