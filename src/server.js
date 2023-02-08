import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogpostsRouter from "./api/blogposts/index.js";
import mongoose from "mongoose";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
import authorsRouter from "./api/authors/index.js";
import usersRouter from "./api/users/index.js";
import createHttpError from "http-errors";

const server = express();

const port = process.env.PORT || 3001;

//Middlewares

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOpts));
server.use(express.json());

//Endpoints

server.use("/blogPosts", blogpostsRouter);
server.use("/authors", authorsRouter);
server.use("/users", usersRouter);

//Error handlers

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("You are connected to Mongo, congrats!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
