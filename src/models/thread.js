const mongoose = require("mongoose");

const threadSchema = mongoose.Schema(
  {
    inputPrompt: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shortenedInputPrompt: {
      type: String,
      required: true,
      default: " ",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("thread", threadSchema);
