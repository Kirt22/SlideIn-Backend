require('dotenv').config();

console.log("MONGO_CONNECTION_STRING:", process.env.MONGO_CONNECTION_STRING);
console.log("MONGO_CONNECTION_STRING:", typeof(process.env.API_KEY));
console.log("MONGO_CONNECTION_STRING:", process.env.SECRET_KEY);
