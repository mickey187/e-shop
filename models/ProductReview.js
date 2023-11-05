const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const productReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    comment: {
      type: String,
      required: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

productReviewSchema.pre('find', function () {
  this.where({isDeleted: false});
});

productReviewSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

productReviewSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ProductReviewSchema.plugin(passportLocalMongoose);
const ProductReview = mongoose.model("ProductReview", productReviewSchema);
module.exports = ProductReview;
