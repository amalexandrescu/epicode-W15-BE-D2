import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./model.js";

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
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
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
              // createdAd: new Date(),
              // updatedAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true }
      );
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog with id ${req.params.blogId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:id/comment/:commentId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:id/comment/:commentId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
