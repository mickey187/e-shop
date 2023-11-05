const mongoose = require("mongoose");
const { Schema } = mongoose;

const errorLogSchema = new Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: new Date(),
    },
    level: {
      type: String,
      required: true,
      default: "error",
    },
    url: {
      type: String,
      required: true,
      default: "N/A",
    },
    message: {
      type: String,
      required: true,
      default: "N/A",
    },
    stack: {
      type: String,
      required: true,
      default: "N/A",
    },
    isFatal: {
      type: Boolean,
      required: true,
      default: false,
    },
    userAgent: {
      type: String,
      required: true,
      default: "N/A",
    },
    clientIp: {
      type: String,
      required: true,
      default: "N/A",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

errorLogSchema.pre('find', function () {
  this.where({isDeleted: false});
});

errorLogSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

errorLogSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const ErrorLog = mongoose.model("ErrorLog", errorLogSchema);

module.exports = ErrorLog;
