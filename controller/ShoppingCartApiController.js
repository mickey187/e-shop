const ShoppingCart = require('../models/ShoppingCart');
const User = require('../models/User');
const Product = require('../models/Product');

exports.addToCart = async(req, res)=>{

    console.log('loggggggggg',await checkProductExist([]));
    // check if user exist with the provided id
    if (await checkUserExists(req.body.customerId)) {

        // check if customer has a shopping cart
        ShoppingCart.exists({customerId: req.body.customerId}, async(err, docs)=>{
            
            // if shopping cart already exists
            if (docs != null) {

                // check if the product in the cart exists
                if (await checkProductExist(req.body.products)) {
                                  var updateCart = await ShoppingCart.updateOne({customerId: req.body.customerId}, {$addToSet: {products: req.body.products}});
                
                                // check if the cart is updated
                if (updateCart.acknowledged == true && updateCart.modifiedCount > 0) {
                    var updatedCart = await ShoppingCart.findById(docs._id).populate(
                        {
                            path: 'products',
                            populate: {
                                path: 'productId'
                            }
                        }
                    );

                    var subTotal = 0.00;
                    updatedCart.products.forEach(element => {

                        subTotal = subTotal + (parseFloat(element.productId.price) * element.quantity);
                    });
    
                    res.json({
                        message: "updated cart",
                        cart: updatedCart,
                        subTotal: subTotal
                    })
                } else if(updateCart.acknowledged == false && updateCart.modifiedCount == 0){
                    res.json({
                        message: "could not update cart",
                        
                    })
                }
                // console.log('updateCart: ', updateCart);
                } else {
                    res.json({
                        message: "product with the provided id does not exist",
                        cart: [],
                        subTotal: null
                    });
                }

            } else {

                if (await checkProductExist(req.body.products)) {
                    var shoppingCart = new ShoppingCart({
                    customerId: req.body.customerId,
                    products: req.body.products
                    });
                    var result = await shoppingCart.save();
                    var cart = await ShoppingCart.findById(result._id).populate(
                    {
                        path: 'products',
                        populate: {
                            path: 'productId'
                        }
                    }
                );
                var subTotal = 0.00;
                cart.products.forEach(element => {
                    subTotal = subTotal + (parseFloat(element.productId.price) * element.quantity);
                });
                } else {
                    res.json({
                        message: "product with the provided id does not exist",
                        cart: [],
                        subTotal: null
                    });
                }
                
    
                
                // console.log(subTotal);
                if (cart != null) {       
                res.json({
                message: "added to cart",
                cart: cart,
                subTotal: subTotal
            });
        }
            }
        });
    } else {
        res.status(404).json({
            message: "customer with this id does not exist",
            cart: [],
            subTotal: null
        });
    }
 
    
}

exports.viewCart = async(req, res)=>{

    ShoppingCart.exists({customerId: req.params.customerId}, async(err, cartId)=>{

        if (cartId != null ) {
            try {
                var cart = await ShoppingCart.findById(cartId).populate(
                    {
                        path: 'products',
                        populate: {
                            path: 'productId'
                        }
                    }
                );
                if (cart.products.length > 0) {
                    res.json({
                    message: "cart found",
                    cart: [cart], 
                    subTotal: calculateSubTotal(cart.products)
                });
                } else {
                    res.json({
                        message: "your cart is empty",
                        cart: []
                    });
                }
                
            } catch (error) {
                res.json({
                    message: "ran into error",
                    error: error
                });
            }

        } else {
            
            res.json({
                message: "could not find customer with provided customer id",
                cart: []
            })
        }
    });

}

exports.editItemQuantityInCart = async(req, res)=>{

    try {
        var updateCart = await ShoppingCart.updateOne({customerId: req.body.customerId,
        "products.productId": req.body.productId }, {$set: {
        "products.$.quantity": req.body.newQuantity
    }});

    

    if (updateCart.acknowledged && updateCart.modifiedCount >0 ) {
        
        var cart = await ShoppingCart.find({customerId: req.body.customerId}).populate(
            {
                path: 'products',
                populate: {
                    path: 'productId'
                }
            }
        );
        res.json({
            message: "updated cart",
            cart: cart,
            subTotal: calculateSubTotal(cart[0].products)
        });
    }

    } catch (error) {
        res.json({
            message: "could not update cart",
            error: error
        });
    }
    
    console.log("result: ", updateCart);

    
    console.log(cart[0]);
    

}

exports.removeItemFromCart = async(req, res)=>{

    // // check if user exist
    // if (await checkUserExists(req.body.customerId)) {

    //     // check if customer has a shopping cart
    //     ShoppingCart.exists({customerId: req.body.customerId}, async(err, docs)=>{

    //         // if shopping cart already exists
    //         if (docs != null) {
                
    //             // check if the product in the cart exists
    //             if (await checkProductExist(req.body.productId)) {
                    
    //             } else {
                    
    //             }
    //         } else {
                
    //         }

    //     });
    // } else {
    //     res.status(404).json({
    //         message: "customer with this id does not exist",
    //         cart: [],
    //         subTotal: null
    //     });
    // }

    var updatedCart = await ShoppingCart.updateOne({customerId: req.body.customerId, "products.productId": req.body.productId },
        { $pull: {"products":  {"productId": req.body.productId}} }    
    );
        console.log(updatedCart);
    if (updatedCart.acknowledged == true && updatedCart.modifiedCount > 0) {
        var cart = await ShoppingCart.find({customerId: req.body.customerId}).populate(
            {
                path: 'products',
                populate: {
                    path: 'productId'
                }
            }
        );
        res.json({
            message: "one item removed from cart",
            cart: cart,
            subTotal: calculateSubTotal(cart[0].products)
        });
    }

}

function calculateSubTotal(cart){

    console.log(cart);
    var subTotal = 0.00;
    cart.forEach(element => {
        console.log(element.productId.price);
        subTotal = subTotal + (parseFloat(element.productId.price) * element.quantity);
    });

    return subTotal;
}

 async function checkUserExists(userId){

    var isUser = null;
    try {
        var user = await User.exists({_id: userId});
        isUser = true;
    } catch (error) {
        isUser = false;
    }

    return isUser;
}

 async function checkProductExist(products){
    var exists = false;
    try {
        var result = await Product.exists({_id: products[0].productId});
        exists = true;
        console.log(result);
    } catch (error) {
        console.error(error);
    }
    return exists;
}
