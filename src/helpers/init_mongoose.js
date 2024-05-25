const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("DB Connected!");
})
.catch((error) => {
    console.log(error);
});