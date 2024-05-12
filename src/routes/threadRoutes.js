const express = require("express");
const multer = require("multer");
const {
  getThreads,
  getGeneratedResponses,
  deleteThread,
  generateResponse,
  deleteAllThread
} = require("../controllers/threadController");
const auth = require("../middleware/auth");

const threadRouter = express.Router();

// Multer middleware for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for handling file as Buffer
const upload = multer({ storage: storage });

threadRouter.get("/get", auth, getThreads);

threadRouter.get("/get/responses/:id", auth, getGeneratedResponses);

threadRouter.delete("/:id", auth, deleteThread);

threadRouter.post("/generate", auth, generateResponse);

threadRouter.get("/deleteAll/:id", auth, deleteAllThread);

// userSessionRouter.post(
//   "/updateUserScore",
//   auth,
//   upload.single("image"),
//   updateUserScore
// );

module.exports = threadRouter;
