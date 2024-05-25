const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

let isConnected = false;

client.on('connect', () => {
    if (!isConnected) {
        console.log('Connected to Redis...');
        isConnected = true;
    }
});

client.on('ready', () => {
    if (!isConnected) {
        console.log('Connected and ready to use Redis...');
        isConnected = true;
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

client.on('end', () => {
    console.log("Redis connection closed...");
    isConnected = false;
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;
