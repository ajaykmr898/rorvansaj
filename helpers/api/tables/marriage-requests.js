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
      village: {
        type: String,
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
      extraInfo: {
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
