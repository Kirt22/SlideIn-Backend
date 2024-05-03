const express = require("express");
const leaderboardRouter = express.Router();
const { getLeaderboard, updateScore } = require("../controllers/leaderboardController");

leaderboardRouter.get("/getLeaderboard", getLeaderboard);
leaderboardRouter.post("/updateScore", updateScore);

module.exports = leaderboardRouter;