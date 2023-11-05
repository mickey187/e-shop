const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },
    orderStatus: {
      type: String,
      enum: ["active", "delivered", "canceled", "delayed"],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.pre('find', function () {
  this.where({isDeleted: false});
});

orderSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

orderSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
