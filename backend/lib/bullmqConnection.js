const IORedis = require("ioredis");
const redisConfig = require("../config/redisConfig");

const bullRedisConnection = new IORedis({
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  maxRetriesPerRequest: null,
});

module.exports = bullRedisConnection;
