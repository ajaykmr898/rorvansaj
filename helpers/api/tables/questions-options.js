import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function questionsOptionsModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      optionText: { type: String, required: true },
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
    mongoose.models.QuestionsOptions ||
    mongoose.model("QuestionsOptions", schema)
  );
}
