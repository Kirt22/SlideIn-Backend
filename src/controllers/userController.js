const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { client } = require("../helpers/init_redis");
const { sendResetEmail } = require("../utils/emailUtils");
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
        await client.zAdd('leaderboard', [{ score: 0, value: result._id.toString() }]);

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

const forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {
        // Check if user exists
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate token
        const secret = process.env.JWT_SECRET_KEY + existingUser.password;
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: "15m" });

        // Generate reset link
        const link = `${process.env.RESET_LINK}/${existingUser._id}/${token}`;

        // Send email
        await sendResetEmail(email, resetLink); // Send email

        res.status(200).json({ message: "Password reset email sent" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}

const resetPassword = async (req, res) => {

    const { userId, token } = req.params;
    const { password } = req.body;

    try {
        // Check if user exists
        const existingUser = await userModel.findOne({ _id: userId });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify token
        const secret = process.env.JWT_SECRET_KEY + existingUser.password;
        const payload = jwt.verify(token, secret);

        // Generate hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await userModel.updateOne({ _id: userId }, { password: hashedPassword });

        res.status(200).json({ message: "Password reset successfull" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
}

module.exports = { signin, signup, forgotPassword, resetPassword }; 