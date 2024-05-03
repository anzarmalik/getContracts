/*
basic redis - client configuration
*/
const redis = require('redis');

let redisClient;

(async () => {
    redisClient = redis.createClient();

    redisClient.on('error', (error) => `Error : ${error}`);

    await redisClient.connect();
})();

module.exports = { redisClient };
