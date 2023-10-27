import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function locationsModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
      address: { type: String, required: true },
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
  return mongoose.models.Locations || mongoose.model("Locations", schema);
}
