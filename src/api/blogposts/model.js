import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    content: { type: String, required: true },
    comments: [{ content: String }],
  },
  {
    timestamps: true, // this option automatically the createdAt and updatedAt fields
  }
);

export default model("Blog", blogsSchema); // this model is now automagically linked to the "blogs" collection, if collection is not there it will be created

// {
//   "_id": "MONGO GENERATED ID",
//   "category": "ARTICLE CATEGORY",
//   "title": "ARTICLE TITLE",
//   "cover":"ARTICLE COVER (IMAGE LINK)",
//   "readTime": {
//     "value": Number,
//     "unit": "minute"
//   },
//   "author": {
//     "name": "AUTHOR NAME",
//     "avatar":"AUTHOR AVATAR LINK"
//   },
//   "content": "HTML",
//   "createdAt": "DATE",
//   "updatedAt": "DATE"
// }
