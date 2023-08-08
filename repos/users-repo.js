import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "helpers/api";

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
    throw "Email or password is incorrect";
  }

  // create a jwt token that is valid for 7 days
  const token = jwt.sign({ sub: user.id }, "secret", {
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
    throw 'Email "' + params.email + '" is already taken';
  }

  const user = new User(params);

  // hash password
  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.email !== params.email &&
    (await User.findOne({ email: params.email }))
  ) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  // copy params properties to user
  Object.assign(user, params);

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function getByRegLink({ regLink }) {
  //let filter = { regLink: regLink };
  return await User.findById(regLink);
}
