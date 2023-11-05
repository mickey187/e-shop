const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    user2: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    messages: [
      {
        senderId: {
          type: Schema.Types.ObjectId,
          ref: "User",
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

chatSchema.pre('find', function () {
  this.where({isDeleted: false});
});

chatSchema.pre('findOne', function () {
  this.where({isDeleted: false});
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
