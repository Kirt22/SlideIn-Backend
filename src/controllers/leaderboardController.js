const userModel = require("../models/user");
const client = require("../index");


const getLeaderboard = async (req, res) => {
    try {
      
      const reply = await client.ZREVRANGEBYRANK("leaderboard", 0, 49, "WITHSCORES");
  
      if (!reply) {
        return res.status(200).json({ leaderboard: [] }); // Empty leaderboard
      }
  
      const leaderboard = [];
      for (let i = 0; i < reply.length; i += 2) {
        const rank = Math.floor(i / 2) + 1; // Calculate rank based on index
        leaderboard.push({ rank, userId: reply[i], score: reply[i + 1] });
      }
  
      res.status(200).json({ leaderboard });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong!" });
    }
};


const updateScore = async (req, res) => {
    const score = req.body.score;
    const userId = req.body.userId;

    client.ZADD("leaderboard", score, userId, (err, reply) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong!" });
        } else {
            res.status(200).json({ message: "Score updated!" });    
        }
    });
}

module.exports = { getLeaderboard, updateScore }; 