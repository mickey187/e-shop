const ShoppingCart = require('../models/ShoppingCart');

exports.addToCart = async(req, res)=>{

//    var results = await ShoppingCart.updateOne({customerId: req.body.customerId},
//      {products: req.body.products}, {upsert: true})
//     console.log(results);
//     res.json({
//         cart: results
//     });
    ShoppingCart.exists({customerId: req.body.customerId}, async(err, docs)=>{

        if (docs != null) {
          var updateCart = await ShoppingCart.updateOne({customerId: req.body.customerId}, {$addToSet: {products: req.body.products}});
            // var updateCart = await ShoppingCart.findByIdAndUpdate(docs._id, {products: req.body.products});
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
                    // console.log(element.productId.price);
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
            console.log('updateCart: ', updateCart);
        } else {
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
            console.log(subTotal);
            if (cart != null) {       
            res.json({
            message: "added to cart",
            cart: cart,
            subTotal: subTotal
        });
    }
        }
    });
    
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
                    cart: cart, 
                    subTotal: calculateSubTotal(cart.products)
                });
                } else {
                    res.json({
                        message: "your cart is empty",
                        cart: cart
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

    var updatedCart = await ShoppingCart.updateOne({customerId: req.body.customerId, "products.productId": req.body.productId },
        { $pull: {"products":  {"productId": req.body.productId}} }    
    );
        console.log(updatedCart);
    if (updatedCart.acknowledged == true && updatedCart.modifiedCount > 0) {
        res.json({
            message: "one item removed from cart",
            cart: "",
            subTotal: 90
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
