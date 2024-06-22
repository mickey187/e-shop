const { mongoose } = require("mongoose");
const User = require("../models/User");
const ShoppingCart = require("../models/ShoppingCart");

const viewCart = async (customerId) => {
  try {
    if (!(await customerExists(customerId))) {
      throw new Error(`User Not Found`);
    }

    if (!(await shoppingCartExists(customerId))) {
      throw new Error(`Cart Not Found`);
    }
    const shoppingCart = await ShoppingCart.findOne({ customerId: customerId }).populate('items.product');
    return shoppingCart;
  } catch (error) {
    console.error(`Error fetching shopping cart: ${error}`);
    throw new Error(`Error fetching shopping cart`);
  }
};
const addToCartService = async (customerId, items) => {
  try {
    console.log(
      "....................",
      new mongoose.Types.ObjectId(items[0].product)
    );
    const customer = await customerExists(new mongoose.Types.ObjectId(customerId));
    console.log("customer", customer);

    if (customer === false) {
      throw new Error(`User Not Found`);
    }

    let shoppingCartExists = await ShoppingCart.findOne({
      customerId: new mongoose.Types.ObjectId(customerId),
    }).populate("items.product");

    if (!shoppingCartExists) {
      // If no shopping cart exists, create a new one
      const newShoppingCart = new ShoppingCart({
        customerId: new mongoose.Types.ObjectId(customerId),
        items: items.map((item) => ({
          product: new mongoose.Types.ObjectId(item.product),
          quantity: item.quantity,
        })),
      });

    await newShoppingCart.save();
     
      return newShoppingCart.populate("items.product");
    } else {
      const existingShoppingCart = await ShoppingCart.findOne({
        customerId: new mongoose.Types.ObjectId(customerId),
      });
      items.forEach((item) => {
        const existingItem = existingShoppingCart.items.find(
          (cartItem) => cartItem.product.toString() === item.product
        );

        if (existingItem) {
          existingItem.quantity = item.quantity;
          
        } else {
          existingShoppingCart.items.push({
            product: new mongoose.Types.ObjectId(item.product),
            quantity: item.quantity,
          });
        }
      });

      await existingShoppingCart.save();
      return existingShoppingCart.populate("items.product");
    }
  } catch (error) {
    // console.error(`Error adding item to shopping cart: ${error}`);
    console.log(error);
    throw new Error(`Error adding item to shopping cart`);
  }
};

const editCartItemQuantityService = async (
  customerId,
  productId,
  newQuantity
) => {
  try {
    console.log("productId", productId);
    if (newQuantity < 1) {
      throw new Error(`Quantity must be greater than or equal to 1`);
    }

    const customer = await customerExists(customerId);
    if (customer === false) {
      throw new Error(`User Not Found`);
    }

    let shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

    console.log("shopping cart:---------", shoppingCart.items);
    console.log("productId ----------------------------", productId);

    if (!shoppingCart) {
      throw new Error(`Shopping Cart Not Found`);
    }

    const existingItem = shoppingCart.items.find(
     
      (cartItem) => cartItem.product.toString() === productId.toString()
    );

    if (!existingItem) {
      throw new Error(`Item not found in the shopping cart`);
    }

    // Update the quantity of the existing item
    existingItem.quantity = newQuantity;

    // Save the updated shopping cart
    shoppingCart = await shoppingCart.save();

    return shoppingCart.populate("items.product");
  } catch (error) {
    console.error(`Error editing item quantity in shopping cart: ${error}`);
    throw new Error(`Error editing item quantity in shopping cart`);
  }
};

// const addToCartService = async (customerId, productId, quantity) => {
//   try {
//     if (!(await customerExists(customerId))) {
//       throw new Error(`User Not Found`);
//     }

//     let shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

//     if (!shoppingCart) {
//       // If no shopping cart exists, create a new one
//       const newShoppingCart = new ShoppingCart({
//         customerId: customerId,
//         products: [{ productId, quantity }],
//       });

//       shoppingCart = await newShoppingCart.save();
//       return shoppingCart;
//     } else {
//       // If a shopping cart exists, update it
//       shoppingCart.products.push({ productId, quantity });
//       shoppingCart = await shoppingCart.save();
//       return shoppingCart;
//     }
//   } catch (error) {
//     console.error(`Error adding to item to shopping cart ${error}`);
//     throw new Error(`Error adding to item to shopping cart`);
//   }
// };

const removeItemFromCartService = async (customerId, productId) => {
  try {
    if (!(await customerExists(customerId))) {
      throw new Error(`User Not Found`);
    }

    // Find the user's shopping cart
    const shoppingCart = await ShoppingCart.findOne({ customerId: new mongoose.Types.ObjectId(customerId) });

    if (!shoppingCart) {
      console.log("No shopping cart found for the user.");
      return;
    }
    console.log("shopping cart", shoppingCart);

    // Find the index of the item in the cart
    const itemIndex = shoppingCart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      shoppingCart.items.splice(itemIndex, 1);

      // Save the updated shopping cart
      await shoppingCart.save();

      console.log("Item removed from the shopping cart successfully.");
      return shoppingCart.populate("items.product");
    } else {
      console.log("Item not found in the shopping cart.");
      throw new Error(`Item not found in the shopping cart.`);
    }
  } catch (error) {
    console.error(`Error removing to item to shopping cart ${error}`);
    throw new Error(`Error removing to item to shopping cart`);
  }
};



const updateCartItemQuantityService = async (
  customerId,
  productId,
  newQuantity
) => {
  try {
    // Find the user by ID
    if (!(await customerExists(customerId))) {
      throw new Error(`User Not Found`);
    }

    // Find the user's shopping cart
    const shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

    if (!shoppingCart) {
      console.log("No shopping cart found for the user.");
      throw new Error(`No shopping cart found for the user.`);
    }

    // Find the item in the cart
    const cartItem = shoppingCart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      // Update the quantity
      cartItem.quantity = newQuantity;

      // Save the updated shopping cart
      await shoppingCart.save();

      console.log("Item quantity updated in the shopping cart successfully.");
      return shoppingCart;
    } else {
      console.log("Item not found in the shopping cart.");
      throw new Error(`Item not found in the shopping cart.`);
    }
  } catch (error) {
    console.error("Error updating item quantity in the shopping cart:", error);
    throw new Error(`Error updating item quantity in the shopping cart`);
  }
};



const calculateCartTotalCostService = async (customerId) => {
  try {
    // Find the user by ID
    const user = await User.findById(customerId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find the user's shopping cart
    const shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

    if (!shoppingCart) {
      console.log("No shopping cart found for the user.");
      return 0; // Return 0 if no cart is found
    }

    // Calculate the total cost
    const totalCost = shoppingCart.products.reduce((acc, item) => {
      // Assuming 'Product' schema has a 'price' field
      const productCost = item.quantity * item.product.price;
      return acc + productCost;
    }, 0);

    console.log("Total cost of items in the shopping cart:", totalCost);
    return totalCost;
  } catch (error) {
    console.error(
      "Error calculating total cost of items in the shopping cart:",
      error.message
    );
    return 0; // Return 0 in case of an error
  }
};

const removeCustomerShoppingCart = async(customerId) => {
  try {
    const deleteCart = await ShoppingCart.deleteOne({customerId: customerId});
    if (deleteCart.deletedCount === 1) {
      return true;
    }
  } catch (error) {
    throw new Error(`could not remove customer shopping cart: ${customerId}`);
  }
}

const customerExists = async (customerId) => {
  try {
    const status = await User.findById(customerId);
    // console.log("customerId", customerId);
    // console.log("status", status);
    if (status) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const shoppingCartExists = async (customerId) => {
  try {
    const status = await ShoppingCart.findOne({ customerId: customerId });
    if (status) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  addToCartService,
  editCartItemQuantityService,
  removeItemFromCartService,
  updateCartItemQuantityService,
  calculateCartTotalCostService,
  customerExists,
  shoppingCartExists,
  viewCart,
  removeCustomerShoppingCart
};
