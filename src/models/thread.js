const mongoose = require("mongoose");

const threadSchema = mongoose.Schema({
     inputPrompt: {
          type: String,
          required: true
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
     }
}, { timestamps: true });

module.exports = mongoose.model("thread", threadSchema);