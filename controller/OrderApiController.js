const Order = require('../models/Order');

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