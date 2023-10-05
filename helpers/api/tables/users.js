import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

export function userModel() {
  const Schema = mongoose.Schema;
  const schema = new Schema(
    {
      email: { type: String, unique: true, required: true },
      hash: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dob: { type: String, required: false },
      regLink: { type: String, required: false },
      regExpTime: { type: String, required: false },
      isSignedUp: { type: String, required: false },
      resetPassLink: { type: String, required: false },
      passExpTime: { type: String, required: false },
      pob: { type: Schema.Types.Mixed, required: false },
      por: { type: Schema.Types.Mixed, required: false },
      level: { type: String, required: false },
      gender: { type: String, required: false },
      phone: { type: String, required: false },
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

  return mongoose.models.User || mongoose.model("User", schema);
}
