import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function chartsModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      curDate: { type: String, required: true },
      open: { type: String, required: true },
      close: { type: String, required: true },
      high: { type: String, required: true },
      low: { type: String, required: true },
      deltaOC: { type: String, required: true },
      deltaHL: { type: String, required: true },
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
  return mongoose.models.Charts || mongoose.model("Charts", schema);
}
