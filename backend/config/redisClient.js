const { createClient } = require("redis");
const redisConfig = require("./redisConfig");
const logger = require("./logger");

const redisClient = createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
  password: redisConfig.password,
});

redisClient.connect().catch(console.error);

redisClient.on("ready", () => logger.info("Redis client connected."));
redisClient.on("error", (err) => logger.error("Redis error:", err));

module.exports = redisClient;
