const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    attributes: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductAttribute",
        required: true,
      },
    ],

    tags: {
      type: Array,
      required: false,
    },

    images: {
      type: Array,
      required: false,
    },

    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  try {
    // Check references and required fields for each field separately

    await validateAndReferenceCheck(
      mongoose.model("ProductCategory"),
      {
        category: this.category,
      },
      ["category"],
      ["category"]
    );

    await validateAndReferenceCheck(
      mongoose.model("ProductAttribute"),
      {
        attributes: this.attributes,
      },
      ["attributes"],
      ["attributes"]
    );


    next();
  } catch (error) {
    console.error(`Error in product model: ${error}`);
    return next(error);
  }
});

productSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

productSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ProductSchema.plugin(passportLocalMongoose);
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
