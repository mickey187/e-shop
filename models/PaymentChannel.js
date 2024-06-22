const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const paymentChannelSchema = new Schema({
  channelName: {
    type: String,
    required: true,
    unique:true
  },

  description: {
    type: String,
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
});


paymentChannelSchema.pre('find', function () {
  this.where({isDeleted: false});
});

paymentChannelSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

paymentChannelSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const PaymentChannel = mongoose.model("PaymentChannel", paymentChannelSchema);
module.exports = PaymentChannel;
