import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";
import moment from "moment";

const User = db.User;

export const usersRepo = {
  authenticate,
  getAll,
  getById,
  create,
  getByRegLink,
  update,
  searchByName,
  delete: _delete,
};

async function authenticate({ email, password }) {
  /*const randomUsers = [];
  for (let i = 0; i < 10000; i++) {
    const user = {
      email: `user${i}@example.com`,
      hash: "randomhash", // You can generate a random hash here if needed
      firstName: `User${i}`,
      lastName: `LastName${i}`,
      // Add more fields as needed
    };
    randomUsers.push(user);
  }

  const result = await User.insertMany(randomUsers);*/

  const user = await User.findOne({ email });
  if (
    !(user && bcrypt.compareSync(password, user.hash)) ||
    !(user && user.deleted === "false")
  ) {
    throw "Email or password are not correct";
  }

  if (!(user && user.isSignedUp === "true")) {
    throw "Account not activated, please check your email and activate your account first";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return {
    ...user.toJSON(),
    token,
  };
}

async function getAll({ page, pageSize, name, dob, gender, pos }) {
  const skip = (page - 1) * pageSize;
  let filters = {};
  if (name) {
    filters.$and = [];
    const nameRegex = new RegExp(name, "i");
    filters.$and.push({
      $or: [
        { firstName: { $regex: nameRegex } },
        { lastName: { $regex: nameRegex } },
        { email: { $regex: nameRegex } },
        { phone: { $regex: nameRegex } },
      ],
    });
  }
  if (dob) {
    if (!filters.$and) {
      filters.$and = [];
    }
    filters.$and.push({ dob: dob });
  }
  if (gender) {
    if (!filters.$and) {
      filters.$and = [];
    }
    filters.$and.push({ gender: gender });
  }
  if (pos && pos?.location) {
    if (!filters.$and) {
      filters.$and = [];
    }
    filters.$and.push({
      $or: [{ "pob.location": pos.location }, { "por.location": pos.location }],
    });
  }
  const totalCount = await User.countDocuments(filters);
  const res = await User.find(filters).skip(skip).limit(pageSize);
  return { users: res, totalCount };
  //return await User.find();
}

async function searchByName({ name }) {
  const regex = new RegExp(name, "i");
  const res = await User.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
      { email: { $regex: regex } },
      { phone: { $regex: regex } },
    ],
  }).limit(100);
  return res;
  //return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(params) {
  // validate
  if (await User.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is not available';
  }

  const user = new User(params);

  // hash password
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  user.password = "";
  user.regExpTime = moment().add("2", "years");
  //user.isSignedUp = "false";

  // save user
  try {
    return await user.save();
  } catch (err) {
    throw "An error occurred while saving user";
  }
}

async function update(id, params) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.email !== params.email &&
    (await User.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is not available';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(user, params);
  user.pob = params.pob;
  user.por = params.por;
  await user.save();
}

async function _delete(id) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { deleted: "true" } },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

async function getByRegLink({ regLink }) {
  let filter = { regLink: regLink };
  return await User.findOne(filter);
}
