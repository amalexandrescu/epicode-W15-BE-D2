import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./model.js";
import q2m from "query-to-mongo";

const blogpostsRouter = express.Router();

blogpostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body);
    const { _id } = await newBlog.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    // console.log("queries: ", req.query);
    // const mongoQuery = q2m(req.query);
    // console.log("mongo queries: ", mongoQuery);
    // const total = await BlogsModel.countDocuments(mongoQuery.criteria);
    // const total = await BlogsModel.findBlogsWithAuthors(mongoQuery);// this is if I want to use the custom method, see the model.js where I declared it
    // console.log("total: ", total);
    // const blogs = await BlogsModel.find()
    //   .sort(mongoQuery.options.sort)
    //   .skip(mongoQuery.options.skip)
    //   .limit(mongoQuery.options.limit);
    // res.send({
    //   links: mongoQuery.links("http:localhost:3001/blogPosts", total),
    //   totalPages: Math.ceil(total / mongoQuery.options.limit),
    //   blogs,
    // });

    //the commented cod eabove is if I want to use some queries when fetching the data

    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId).populate({
      path: "author",
      select: "name email",
    });
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true }
    );

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deletedBlog = await BlogsModel.findByIdAndDelete(req.params.blogId);

    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// ********************** Embedding comments into blogposts ************************

blogpostsRouter.post("/:id", async (req, res, next) => {
  try {
    //in the req.body we will have the content of the comment we want to add

    //we need to find the blog we want to update using the id from the params and update it with
    //the comment from the req.body

    const searchedBlog = await BlogsModel.findById(req.params.id);

    if (searchedBlog) {
      const updatedBlog = await BlogsModel.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            comments: {
              ...req.body,
            },
          },
        },
        { new: true, runValidators: true }
      );
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const searchedBlog = await BlogsModel.findById(req.params.id);

    if (searchedBlog) {
      res.send(searchedBlog.comments);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const searchedBlog = await BlogsModel.findById(req.params.id);

    if (searchedBlog) {
      // console.log("searched blog", searchedBlog);
      const searchedComment = searchedBlog.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (searchedComment) {
        res.send(searchedComment);
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(createHttpError(404, `Blog with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:id/comment/:commentId", async (req, res, next) => {
  try {
    const searchedBlog = await BlogsModel.findById(req.params.id);
    //returns a mongoose document

    if (searchedBlog) {
      const index = searchedBlog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        searchedBlog.comments[index] = {
          ...searchedBlog.comments[index].toObject(),
          ...req.body,
        };

        await searchedBlog.save();
        res.send(searchedBlog);
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found`
          )
        );
      }
    } else {
      next(createHttpError(404, `Blog with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:id/comment/:commentId", async (req, res, next) => {
  try {
    const updatedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
