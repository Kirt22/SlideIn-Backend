const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: false,
        default: 0
    },
    uses: {
        type: Number,
        required: true,
        default: 15
    },
    subscription: {
        type: String,
        required: true,
        default: "free",
        enum: ['free', 'pro']
    },
    lastResetDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);