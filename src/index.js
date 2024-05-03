const express = require("express");
const userRouter = require("./routes/userRoutes");
const threadRouter = require("./routes/threadRoutes");
const leaderboardRouter = require("./routes/leaderboardRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
const { createClient } = require('redis');

dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT    
    }
});

client.on('error', err => {
    console.log('Error ' + err);
});

client.on('ready', () => {
    console.log("Redis is connected!");
});



const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Router paths
app.use("/users", userRouter);
app.use("/thread", threadRouter);
//app.use("/leaderboard", leaderboardRouter);

// Root Route
app.get("/test", (req, res) => {
    res.json({message: "Welcome to SlideIn API"});
});

// MongoDB connection 
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
        console.log("DB Connected!");
    }).catch((error) => {
        console.log(error);
    });

module.exports = client;