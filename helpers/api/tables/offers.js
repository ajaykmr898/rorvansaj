import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function offersModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      types: { type: String, required: false },
      userId: { type: mongoose.Schema.ObjectId, required: false },
      title: { type: String, required: false },
      description: { type: String, required: false },
      from: { type: String, required: false },
      to: { type: String, required: false },
      visibility: { type: String, required: false },
      charge: { type: String, required: false }, //cost
      viewed: { type: String, required: false }, //how many times sent to FE
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
  return mongoose.models.Offers || mongoose.model("Offers", schema);
}
