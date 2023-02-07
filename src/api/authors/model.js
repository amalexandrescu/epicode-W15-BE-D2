import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

authorsSchema.static("checkCredentials", async function (email, password) {
  const author = await this.findOne({ email });
  if (author) {
    const passwordMatch = await bcrypt.compare(password, author.password);
    if (passwordMatch) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("Author", authorsSchema);
