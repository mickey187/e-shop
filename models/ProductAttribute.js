const mongoose = require("mongoose");
eUnifiedTopology: true;
// });
// const passportLocalMongoose = require('passport-local-mongoose');

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

    Product: [
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

productAttributeSchema.pre('find', function () {
  this.where({isDeleted: false});
});

productAttributeSchema.pre('findOne', function () {
  this.where({isDeleted: false});
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
