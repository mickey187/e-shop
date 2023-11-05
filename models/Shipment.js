const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const shipmentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },

    fromAddress: {
      type: String,
      required: true,
    },

    toAddress: {
      type: String,
      required: true,
    },

    shippingMethod: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shipmentSchema.pre('find', function () {
  this.where({isDeleted: false});
});

shipmentSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

shipmentSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ShipmentSchema.plugin(passportLocalMongoose);
const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;
