const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { signAccessToken, signRefreshToken, hashToken } = require("../utils/tokens");
const { setAuthCookies, clearAuthCookies } = require("../utils/cookies");
const env = require("../config/env");

const issueSession = async (res, user) => {
  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, tokenId);
  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();
  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, user: user.safeProfile() };
};

const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.validated.body);
  const session = await issueSession(res, user);
  sendSuccess(res, 201, "Account created", session);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password +refreshTokenHash");
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is disabled");

  const session = await issueSession(res, user);
  sendSuccess(res, 200, "Logged in", session);
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Current user", { user: req.user.safeProfile() });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "Refresh token required");

  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.sub).select("+refreshTokenHash");
  if (!user || user.refreshTokenHash !== hashToken(token)) throw new ApiError(401, "Invalid refresh token");

  const session = await issueSession(res, user);
  sendSuccess(res, 200, "Session refreshed", session);
});

const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshTokenHash = undefined;
    await req.user.save();
  }
  clearAuthCookies(res);
  sendSuccess(res, 200, "Logged out");
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.validated.body.email }).select("+passwordResetToken +passwordResetExpires");
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
  }
  sendSuccess(res, 200, "If the account exists, a reset instruction will be sent");
});

module.exports = { register, login, me, refresh, logout, forgotPassword };
