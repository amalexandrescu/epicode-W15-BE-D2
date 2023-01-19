import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogpostsRouter from "./api/blogposts/index.js";
import mongoose from "mongoose";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import authorsRouter from "./api/authors/index.js";

const server = express();

const port = process.env.PORT || 3001;

//Middlewares

server.use(cors());
server.use(express.json());

//Endpoints

server.use("/blogPosts", blogpostsRouter);
server.use("/authors", authorsRouter);

//Error handlers

server.use(badRequestHandler);
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
