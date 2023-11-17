import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function gotrasModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      name: { type: String, required: true },
      desc: { type: String, required: false },
      history: { type: String, required: false },
      rors: { type: String, required: false },
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
  return mongoose.models.Gotras || mongoose.model("Gotras", schema);
}
