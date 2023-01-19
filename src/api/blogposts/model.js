import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    content: String,
  },
  {
    timestamps: true,
  }
);

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
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Author",
      // name: { type: String, required: true },
      // avatar: { type: String, required: true },
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    content: { type: String, required: true },
    comments: [commentsSchema],
  },
  {
    timestamps: true, // this option automatically the createdAt and updatedAt fields
  }
);

// blogsSchema.static("findBlogsWithAuthors", async function (query) {
//   const total = await this.countDocuments(query.criteria);

//   const blogs = await this.find(query.criteria, query.options.fields)
//     .skip(query.options.skip)
//     .limit(query.options.limit)
//     .sort(query.options.sort)
//     .populate({
//       path: "comments",
//       select: "content",
//     });

//   return { total, blogs };
// });

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
