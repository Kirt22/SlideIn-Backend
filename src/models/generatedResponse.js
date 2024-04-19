const mongoose = require("mongoose");

const generatedResponseSchema = mongoose.Schema({
     tweakingParameters: {
          flirty: {
               type: Number,
               required: true,
               default: 1
             },
             rude: {
               type: Number,
               required: true,
               default: 1
             },
             cheezy: {
               type: Number,
               required: true,
               default: 1
             },
             naughty: {
               type: Number,
               required: true,
               default: 1
             }
     },
     generatedResponse: {
          type: String,
          required: true
     },
     isVerfied: {
          type: Boolean,
          default: false,
          required: false
     },
     promptId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "session",
          required: true
     },
}, { timestamps: true });

module.exports = mongoose.model("generatedResponse", generatedResponseSchema);