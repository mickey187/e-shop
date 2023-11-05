const mongoose = require("mongoose");
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;
const shoppingCartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    products: [
      {
        _id: false,
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },

        isDeleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);


shoppingCartSchema.pre('find', function () {
  this.where({isDeleted: false});
});

shoppingCartSchema.pre('findOne', function () {
  this.where({isDeleted: false});
});

shoppingCartSchema.methods.softDelete = async function () {
  try {
    this.isDeleted = true;
    await this.save();
    return true; // Soft delete was successful
  } catch (error) {
    return false; // Soft delete failed
  }
};

// ShoppingCartSchema.plugin(passportLocalMongoose);
const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
module.exports = ShoppingCart;
