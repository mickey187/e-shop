const Order = require('../models/Order');
const User = require('../models/User');
const ShoppingCart = require('../models/ShoppingCart');
const Payment = require('../models/Payment');
const generateUniqueId = require('generate-unique-id');


exports.placeOrder = async(req, res)=>{


    var order = new Order({
        customerId: req.body.customerId,
        products: req.body.products,
        trackingNumber: req.body.trackingNumber,
        orderStatus: "active",
    });

    var result = await order.save();
    if (result != null) {
        res.json({
            status: "success",
            message: "Order placed successfully",
            order: result
        });
    } else{
        res.json({
            status: "failed",
            message: "Could not place the order requested please try again"
        });
    }
}

exports.placeOrderStripe = async(orderDetail)=>{
    
    // console.log("order detail",orderDetail);
    // console.log("duplicate status: " + await checkDuplicateOrder(orderDetail.id));

    // console.log("order detail ", orderDetail);
    var isDuplicateOrder = await checkDuplicateOrder(orderDetail.id);
    if (!isDuplicateOrder) {
        var cartDetail = await fetchCartDetail(orderDetail.billing_details.email);
        var isCartEmptyy = await isCartEmpty(cartDetail[0]);
        if (!isCartEmptyy) {
            // var cartDetail = await fetchCartDetail(orderDetail.billing_details.email);
        var order = new Order({
        customerId: cartDetail[0],
        products: cartDetail[1],
        trackingNumber: await generateOrderTrackingNumber(cartDetail[0]),
        paymentReference: orderDetail.id,
        orderStatus: "active",
    });

    try {
        var status = await order.save();
        if (status != null) {
        console.log("successfully saved order "+ status);
        emptyCart(cartDetail[0]);
        var paymentRecord = {
            customerId: cartDetail[0],
            orderId: order._id,
            paymentChannel: orderDetail.payment_method_details.card.brand,
            paymentReference: orderDetail.id,
            totalAmountPaid: orderDetail.amount,
            transactionNumber: await generateTransactionNumber(orderDetail.id)
        } 
        await recordPayment(paymentRecord);
        return true;
        }
        
    } catch (error) {
        console.log("could not save order "+ error.message);
        return false;
    }
        } else {
            console.log("could not save order because cart is empty");
        }
        
    } else {
        console.log("there is an active order with payment reference: "+ orderDetail.id);
    }
    

    
}

async function checkDuplicateOrder(paymentReference){

    var exists = await Order.exists({paymentReference: paymentReference});
    // console.log(exists);
    if (exists != null) {
        return true;
    } else {
        return false;
    }
}

async function fetchCartDetail(email){

    var customer = await User.find({email: email}).select('_id');
    var customerId = customer[0]._id;
    var shoppingCart = await ShoppingCart.find({customerId: customerId}).select('products');
    var cartDetail = [];
    cartDetail.push(customerId);
    cartDetail.push(shoppingCart);
    console.log(cartDetail.products);
    return cartDetail;
}

async function recordPayment(paymentRecord){

    var payment = new Payment(paymentRecord);
    var status = await payment.save();
    if (status != null) {
        console.log("payment recorded successfully", status);
        return true;
    } else {
        console.log("couldn't save payment");
        return false;
    }
}

async function generateTransactionNumber(paymentReference){

    var date = new Date(Date.now());
    var formatted_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    console.log(date.toISOString());
    const transactionNumber = "trn" + "-" + formatted_date +"-"+ paymentReference;
    
    return transactionNumber;
}

async function generateOrderTrackingNumber(customerId){

    var date = new Date(Date.now());
    var formatted_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    console.log(date.toISOString());
    const trackingNumber = "ord" + "-" + formatted_date +"-"+ customerId;

    return trackingNumber;

}

async function emptyCart(customerId){

    var updatedCart = await ShoppingCart.updateOne({customerId: customerId},
        { $set: { products: [] } }    
    );
        // console.log(updatedCart);
    if (updatedCart.acknowledged == true && updatedCart.modifiedCount > 0) {
        console.log("shopping cart emptied");
        return true;
    }else{
        return false;
    }
}

async function isCartEmpty(customerId){

    var cart = await ShoppingCart.findOne({customerId: customerId}).lean();
    var productArray = cart.products;
    console.log("cart: ",cart);
    if (cart.products.length > 0) {
        console.log("cart is not empty");
        return false;
    } else {
        console.log("cart is empty");
        return true;
    }
    
}

