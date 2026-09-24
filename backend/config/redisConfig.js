const path = require("path");
const env = process.env.NODE_ENV || "development";
const { config } = require("dotenv");
config({ path: path.resolve(process.cwd(), `./env/.env.${env}`) });

const redisConfig = {
  host: process.env.REDIS_CONNECT_HOST,
  port: process.env.REDIS_CONNECT_PORT,
  password: process.env.REDIS_CONNECT_PASSWORD,
};

module.exports = redisConfig;
