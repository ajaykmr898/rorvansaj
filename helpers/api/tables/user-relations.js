import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function userRelationsModel() {
  const Schema = mongoose.Schema;
  const schema = new Schema(
    {
      userId: { type: mongoose.Schema.ObjectId, unique: true, required: true },
      relatedUserId: { type: mongoose.Schema.ObjectId, required: true },
      relation: { type: String, required: true },
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

  return (
    mongoose.models.userRelations || mongoose.model("userRelations", schema)
  );
}
