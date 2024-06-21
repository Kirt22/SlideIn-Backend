const userModel = require("../models/user");
const { client } = require("../helpers/init_redis");
const user = require("../models/user");


const getLeaderboard = async (req, res) => {

  try {

    let leaderboard = [];

    const result = await client.ZRANGEBYSCORE_WITHSCORES("leaderboard", 0, 49);

    if (!result) {
      return res.status(200).json({ leaderboard }); // Empty leaderboard
    }

    for (let i = result.length - 1; i >= 0; i--) {
      let user = await userModel.findById(result[i].value);
      leaderboard.push(user);
    }

    res.status(200).json(leaderboard);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = { getLeaderboard }; 