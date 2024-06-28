const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");
const { required } = require("joi");

const Schema = mongoose.Schema;

const productReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      required: true,
    },
    title: {
      type: String,
      required: false,
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

productReviewSchema.pre("save", async function (next) {
  try {
    // Check references and required fields for each field separately

    await validateAndReferenceCheck(
      mongoose.model("Product"),
      {
        productId: this.productId,
      },
      ["productId"],
      []
    );

    await validateAndReferenceCheck(
      mongoose.model("User"),
      {
        customerId: this.customerId,
      },
      ["customerId"],
      ["customerId"]
    );

    next();
  } catch (error) {
    return next(error);
  }
});

productReviewSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productReviewSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
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
