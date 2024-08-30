const express = require("express");
const multer = require("multer");
const {
  getThreads,
  getGeneratedResponses,
  deleteThread,
  generateResponse,
  deleteAllThread,
} = require("../controllers/threadController");
const auth = require("../middleware/auth");

const threadRouter = express.Router();

threadRouter.get("/get", auth, getThreads);

threadRouter.get("/get/responses/:id", auth, getGeneratedResponses);

threadRouter.delete("/:id", auth, deleteThread);

threadRouter.post("/generate", auth, generateResponse);

threadRouter.get("/deleteAll/:id", auth, deleteAllThread);

module.exports = threadRouter;
