import mongoose from "mongoose";
import { userModel } from "helpers/api/tables/users";
import { userRelationsModel } from "./tables/user-relations";
import { offersModel } from "./tables/offers";
import { relationsModel } from "./tables/relations";

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Offers: offersModel(),
  Relations: relationsModel(),
  UserRelations: userRelationsModel(),
};
