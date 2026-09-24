const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const { config } = require("dotenv");
config({ path: path.resolve(process.cwd(), `./env/.env.${env}`) });

const signAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, tenantId: user.tenant_id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const signRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" },
  );
  await redisClient.set(`refresh:${user._id}`, refreshToken, {
    EX: 60 * 60 * 24 * 15,
  });
  return refreshToken;
};

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

const verifyRefreshToken = async (token) => {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const stored = await redisClient.get(`refresh:${decoded.userId}`);
  if (stored !== token) throw new Error("Token mismatch");
  return decoded;
};

const revokeRefreshToken = async (userId) => {
  await redisClient.del(`refresh:${userId}`);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
};
