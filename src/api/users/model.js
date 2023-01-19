import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 65 },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
// this model is now binded to the "users" collection, if the collection does not exist, mongoose will create it
