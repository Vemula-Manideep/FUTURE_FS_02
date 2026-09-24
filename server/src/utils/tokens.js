const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/env");

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, permissions: user.permissions },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL }
  );

const signRefreshToken = (user, tokenId) =>
  jwt.sign({ sub: user._id.toString(), jti: tokenId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL,
  });

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

module.exports = { signAccessToken, signRefreshToken, hashToken };
