import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function questionsModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      correctOption: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Options",
      },
      questionText: { type: String, required: true },
      questionType: { type: String, required: true },
      options: [
        { type: mongoose.Schema.ObjectId, required: false, ref: "Options" },
      ],
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
  return mongoose.models.Questions || mongoose.model("Questions", schema);
}
