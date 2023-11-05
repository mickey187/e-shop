const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokenBlacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);
tokenBlacklistSchema.pre('find', function () {
  this.where({isDeleted: false});
});

tokenBlacklistSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

tokenBlacklistSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
module.exports = TokenBlacklist;
