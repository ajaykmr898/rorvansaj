import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function answersModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      questionId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Questions",
      },
      url: { type: mongoose.Schema.ObjectId, required: true, ref: "Users" },
      answerText: { type: String, required: false },
      selectedOptions: [{ type: mongoose.Schema.ObjectId, ref: "Options" }],
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
  return mongoose.models.Answers || mongoose.model("Answers", schema);
}
