const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("connect", () => {
  console.log("Trying to connect to Redis...");
});

client.on("ready", () => {
  console.log("Connected and ready to use Redis...");
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

client.on("end", () => {
  console.log("Redis connection closed...");
});

if (!client.isOpen) {
  client.connect();
}

exports.client = client;
