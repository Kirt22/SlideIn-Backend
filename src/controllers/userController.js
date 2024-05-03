const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../index");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res) => {

    const { username, email, password } = req.body;

    try {

        // Check if user exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Generate hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Genreate new user
        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username
        });

        // Generate token
        const token = jwt.sign({ email: result.email, id: result._id }, JWT_SECRET_KEY);

        // generate a new redis sorted set 
        client.zadd("leaderboard", 0, result._id.toString());

        res.status(201).json({ message: "Sign up successfull!", user: result, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }

}

const signin = async (req, res) => {

    const { email, password } = req.body;

    try {

        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchedPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SECRET_KEY);

        res.status(200).json({ message: "Sign in successfull!", user: existingUser, token: token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }

}

module.exports = { signin, signup }; 