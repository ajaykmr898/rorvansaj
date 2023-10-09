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
  delete: _delete,
};

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (!(user && bcrypt.compareSync(password, user.hash))) {
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

async function getAll() {
  return await User.find();
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
  user.isSignedUp = "false";

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
  await User.findByIdAndRemove(id);
}

async function getByRegLink({ regLink }) {
  let filter = { regLink: regLink };
  return await User.findOne(filter);
}
