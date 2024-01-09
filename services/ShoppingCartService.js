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
    const shoppingCart = await ShoppingCart.findOne({ customerId: customerId });
    return shoppingCart;
  } catch (error) {
    console.error(`Error fetching shopping cart: ${error}`);
    throw new Error(`Error fetching shopping cart`);
  }
};
const addToCartService = async (customerId, items) => {
  try {
    const customer = await customerExists(customerId);
    if (customer === false) {
      throw new Error(`User Not Found`);
    }

    let shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

    if (!shoppingCart) {
      // If no shopping cart exists, create a new one
      const newShoppingCart = new ShoppingCart({
        customerId: customerId,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      });

      shoppingCart = await newShoppingCart.save();
      return shoppingCart;
    } else {
      // If a shopping cart exists, update it
      items.forEach((item) => {
        const existingItem = shoppingCart.products.find(
          (cartItem) => cartItem.productId.toString() === item.product
        );
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          shoppingCart.products.push({
            productId: item.product,
            quantity: item.quantity,
          });
        }
      });

      shoppingCart = await shoppingCart.save();
      return shoppingCart;
    }
  } catch (error) {
    console.error(`Error adding item to shopping cart: ${error}`);
    throw new Error(`Error adding item to shopping cart`);
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
    const shoppingCart = await ShoppingCart.findOne({ customerId: customerId });

    if (!shoppingCart) {
      console.log("No shopping cart found for the user.");
      return;
    }

    // Find the index of the item in the cart
    const itemIndex = shoppingCart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex !== -1) {
      // Remove the item from the array
      shoppingCart.products.splice(itemIndex, 1);

      // Save the updated shopping cart
      await shoppingCart.save();

      console.log("Item removed from the shopping cart successfully.");
      return shoppingCart;
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

const customerExists = async (customerId) => {
  try {
    const status = await User.findById(customerId);
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
  removeItemFromCartService,
  updateCartItemQuantityService,
  calculateCartTotalCostService,
  customerExists,
  shoppingCartExists,
  viewCart
};
