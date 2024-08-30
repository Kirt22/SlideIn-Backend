const { client } = require("../helpers/init_redis");
const userModel = require("../models/user");

async function updateScore(score, userId) {
  let currentScore = 0;

  try {
    const mongoResult = await userModel.findByIdAndUpdate(
      userId,
      { score: score + 1 },
      { new: true }
    );
    currentScore = mongoResult.score;
    const redisResult = await client.zAdd("leaderboard", [
      { score: currentScore, value: userId },
    ]);
    console.log(redisResult);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { updateScore };
