import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function marriageRequestsModel() {
  const Schema = mongoose.Schema;

  const schema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: Schema.Types.Mixed,
        required: true,
      },
      age: {
        type: String,
        required: true,
      },
      job: {
        type: String,
        required: true,
      },
      study: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      extraInfo: {
        type: String,
        required: false,
      },
      userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
      status: { type: String, required: false },
      deleted: {
        type: String,
        required: false,
      },
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
    mongoose.models.MarriageRequests ||
    mongoose.model("MarriageRequests", schema)
  );
}
