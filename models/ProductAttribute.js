const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;

const productAttributeSchema = new Schema(
  {
    attributeName: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: true,
    },

    product: [
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

productAttributeSchema.pre("save", async function (next) {
  try {
    // Check references and required fields for each field separately

    await validateAndReferenceCheck(
      mongoose.model("Product"),
      {
        product: this.product,
      },
      ["product"],
      []
    );

    next();
  } catch (error) {
    return next(error);
  }
});

productAttributeSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productAttributeSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

productAttributeSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ProductAttributeSchema.index({attributeName: 1, value: -1}, {unique: true});
// ProductAttributeSchema.plugin(passportLocalMongoose);
const ProductAttribute = mongoose.model(
  "ProductAttribute",
  productAttributeSchema
);
module.exports = ProductAttribute;
