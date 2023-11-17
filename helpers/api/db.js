import mongoose from "mongoose";
import { userModel } from "helpers/api/tables/users";
import { userRelationsModel } from "./tables/user-relations";
import { offersModel } from "./tables/offers";
import { relationsModel } from "./tables/relations";
import { filesModel } from "./tables/files";
import { locationsModel } from "./tables/locations";
import { questionsModel } from "./tables/questions";
import { answersModel } from "./tables/answers";
import { questionsOptionsModel } from "./tables/questions-options";
import { marriageRequestsModel } from "./tables/marriage-requests";
import { gotrasModel } from "./tables/gotras";

const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Offers: offersModel(),
  Relations: relationsModel(),
  UserRelations: userRelationsModel(),
  Files: filesModel(),
  Locations: locationsModel(),
  Questions: questionsModel(),
  Answers: answersModel(),
  QuestionsOptions: questionsOptionsModel(),
  MarriageRequests: marriageRequestsModel(),
  Gotras: gotrasModel(),
};
