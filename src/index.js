const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const threadRouter = require("./routes/threadRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");
const verifyRouter = require("./routes/verifyRoutes");
require("./helpers/init_mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Router paths
app.use("/users", userRouter);
app.use("/thread", threadRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/verify", verifyRouter);

// Root Route
app.get("/welcome", (req, res) => {
    res.json({ message: "Welcome to SlideIn API" });
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
