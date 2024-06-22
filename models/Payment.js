const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;
const paymentSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // orderId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Order",
    //   required: true,
    // },

    paymentChannel: {
      type: Schema.Types.ObjectId,
      ref: "PaymentChannel",
      required: true,
    },

    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },

    totalAmountPaid: {
      type: Number,
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


paymentSchema.pre("save", async function (next) {
  try {
      // Check references and required fields for each field separately

      await validateAndReferenceCheck(
          mongoose.model("User"),
          {
            customerId: this.customerId,
          },
          ["customerId"],
          ["customerId"]
      );

    //   await validateAndReferenceCheck(
    //     mongoose.model("Order"),
    //     {
    //         orderId: this.orderId,
    //     },
    //     ["orderId"],
    //     ["orderId"]
    // );

  

      next();
  } catch (error) {
      return next(error);
  }
});

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
