const express = require("express");
const userRouter = require("./routes/userRoutes");
const threadRouter = require("./routes/threadRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Router paths
app.use("/users", userRouter);
app.use("/thread", threadRouter);

// Root URL
app.get((req, res) => {
    res.send("Welcome to SlideIn API");
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