import { db } from "helpers/api";

const UserRelations = db.UserRelations;

export const relationsRepo = {
  getAll,
  getByUserId,
  create,
  delete: _delete,
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
    .exec();
}

async function getAll() {
  return await UserRelations.find();
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