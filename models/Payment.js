const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const paymentSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    paymentChannel: {
      type: String,
      required: true,
    },

    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },

    totalAmountPaid: {
      type: mongoose.Types.Decimal128,
      required: true,
    },

    transactionNumber: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);
paymentSchema.pre('find', function () {
  this.where({isDeleted: false});
});

paymentSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

paymentSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
