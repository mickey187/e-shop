const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;

const productCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        sparse: true,
        ref: "Product",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productCategorySchema.pre("save", async function (next) {
  try {
    // Check references and required fields for each field separately

    await validateAndReferenceCheck(
      mongoose.model("Product"),
      {
        user1: this.user1,
      },
      ["product"],
      []
    );

    next();
  } catch (error) {
    return next(error);
  }
});

productCategorySchema.index({ category: 1, subCategory: -1 }, { unique: true });

productCategorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productCategorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

// In your schema definition
productCategorySchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ProductCategorySchema.plugin(passportLocalMongoose);
const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);
module.exports = ProductCategory;
