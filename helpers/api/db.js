import mongoose from "mongoose";
import { userModel } from "helpers/api/tables/users";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
};
