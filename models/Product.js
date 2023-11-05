const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: mongoose.Types.Decimal128,
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
    },

    attributes: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductAttribute",
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

productSchema.pre('find', function () {
  this.where({isDeleted: false});
});

productSchema.pre('findOne', function () {
  this.where({isDeleted: false});
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
