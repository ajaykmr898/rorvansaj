import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function relationsModel() {
  const Schema = mongoose.Schema;
  const schema = new Schema(
    {
      relation: { type: String, required: true },
      nodes: { type: String, required: false }, // how many times a person can use this relation -> father is only one
      maxGenerations: { type: String, required: false }, // how many generations behind -> 1 is current, 2, 3 etc
      counterRelation: { type: String, required: false },
    },
    {
      // add createdAt and updatedAt timestamps
      timestamps: true,
      strict: false,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.Relations || mongoose.model("Relations", schema);
}
