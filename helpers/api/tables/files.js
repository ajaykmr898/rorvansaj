import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function filesModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      offerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Offers",
      },
      url: { type: String, required: true },
      type: { type: String, required: false },
      deleted: { type: String, required: false },
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
  return mongoose.models.Files || mongoose.model("Files", schema);
}
