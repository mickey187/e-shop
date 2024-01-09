const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        message: {
          type: String,
        },

        attachement: {
          type: String,
        },

        isSeen: {
          type: Boolean,
          default: false,
        },
        sentDate: {
          type: Date,
          required: true,
        },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

chatSchema.pre("save", async function (next) {
  try {
      // Check references and required fields for each field separately

      await validateAndReferenceCheck(
          mongoose.model("User"),
          {
              user1: this.user1,
          },
          ["user1"],
          ["user1"]
      );

      await validateAndReferenceCheck(
        mongoose.model("User"),
        {
            user2: this.user2,
        },
        ["user2"],
        ["user2"]
    );

  

      next();
  } catch (error) {
      return next(error);
  }
});

chatSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

chatSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

chatSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
