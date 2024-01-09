const mongoose = require("mongoose");
const {
  validateAndReferenceCheck,
} = require("../utils/ValidateModelReference");

const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const shoppingCartSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  items: [cartItemSchema],
  
});


// const shoppingCartSchema = new Schema(
//   {
//     customerId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       unique: true,
//       required: true,
//     },
//     products: [
//       {
//         _id: false,
//         productId: {
//           type: Schema.Types.ObjectId,
//           ref: "Product",
//           min: 1,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },

//         isDeleted: { type: Boolean, default: false },
//       },
//     ],
//   },
//   { timestamps: true }
// );



shoppingCartSchema.pre("save", async function (next) {
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
    next();
  } catch (error) {
    return next(error);
  }
});

cartItemSchema.pre("save", async function (next) {
  try {
    // Check references and required fields for each field separately

    await validateAndReferenceCheck(
      mongoose.model("Product"),
      {
        product: this.product,
      },
      ["product"],
      ["product"]
    );
    next();
  } catch (error) {
    return next(error);
  }
});



// shoppingCartSchema.pre("find", function () {
//   this.where({ isDeleted: false });
// });

// shoppingCartSchema.pre("findOne", function () {
//   this.where({ isDeleted: false });
// });

// shoppingCartSchema.methods.softDelete = async function () {
//   try {
//     this.isDeleted = true;
//     await this.save();
//     return true; // Soft delete was successful
//   } catch (error) {
//     return false; // Soft delete failed
//   }
// };

// ShoppingCartSchema.plugin(passportLocalMongoose);
const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
module.exports = ShoppingCart;
