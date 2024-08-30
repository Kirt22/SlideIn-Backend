const express = require("express");
const verifyRouter = express.Router();
const { verify, getPresignedURL } = require("../controllers/verifyController");
const auth = require("../middleware/auth");

verifyRouter.post("/", auth, verify);
verifyRouter.get("/getPresignedURL", auth, getPresignedURL);

module.exports = verifyRouter;
