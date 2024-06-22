require('dotenv').config();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const TokenBlacklist = require("../models/TokenBlacklist");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;




const createUser = async(user) => {
    try {
        return await User.create(user);
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }

}


const generateToken = (user) => {
  try {
    console.log("Secret Key: ", secretKey);
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      secretKey
    );
    return token;
  } catch (error) {
    throw new Error(`Error generating token ${error.message}`);
  }
};

const formatToken = (token) => {
  try {
    const tokenWithoutBearer = token.replace("Bearer ", "").replace(/\s/g, "");
    return tokenWithoutBearer;
  } catch (error) {
    throw new Error(`Error formatting JWT Token${error.message}`);
  }
};
const authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    // Check if the user exists and the password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return false;
    }

    // Create a JWT token
    const token = generateToken(user);

    // Return the token to the client
    return {token:token, user: user};
  } catch (error) {
    console.error("Error logging in:", error)
    throw new Error(`Error logging in :${error.message}`);
  }
};

const invalidateUser = async (token) => {
  try {
    const formattedToken = formatToken(token);
    // Check if the token is in the blacklist (logged out)
    const isTokenBlacklisted = await TokenBlacklist.findOne({ token: formattedToken }).exec();
    if (isTokenBlacklisted) {
      console.log("Token is already invalidated (logged out)");
      return 401;
    } else {
      const tokenBlackList = await TokenBlacklist.create({
        token: formattedToken,
      });
      console.log("Logout successful");
      return 200;
    }
  } catch (error) {
    throw new Error(`Logout Error ${error.message}`);
  }
};

module.exports = { createUser, authenticateUser, invalidateUser, generateToken, formatToken };
