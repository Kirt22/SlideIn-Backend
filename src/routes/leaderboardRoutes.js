const express = require("express");
const leaderboardRouter = express.Router();
const auth = require("../middleware/auth");
const { getLeaderboard } = require("../controllers/leaderboardController");

leaderboardRouter.get("/getLeaderboard", auth, getLeaderboard);

module.exports = leaderboardRouter;