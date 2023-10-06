import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function relationsModel() {
  const Schema = mongoose.Schema;
  const schema = new Schema(
    {
      relation: { type: String, required: true },
      nodes: { type: String, required: true }, // how many times this relation may repeat -> father only ones
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
