import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function filesModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      userId: { type: mongoose.Schema.ObjectId, required: false },
      url: { type: String, required: false },
      type: { type: String, required: false },
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
