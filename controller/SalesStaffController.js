
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
var session = require('express-session');
exports.salesStaffDashboard = async(req, res)=>{

    var activeOrderCount = await Order.find({orderStatus: "active"}).count();
    var deliveredOrderCount = await Order.find({orderStatus: "delivered"}).count();
    var canceledOrderCount = await Order.find({orderStatus: "canceled"}).count();
    var delayedOrderCount = await Order.find({orderStatus: "delayed"}).count();
    res.render('sales_staff/sales_staff_dashboard',
         {layout: 'sales_staff_layout',
          user: req.user,
          activeOrderCount: activeOrderCount,
          delayedOrderCount: delayedOrderCount,
          canceledOrderCount: canceledOrderCount,
          deliveredOrderCount: deliveredOrderCount

        })
}

exports.manageOrders = async(req, res)=>{

    var order = null;
    order = await Order.find().populate('customerId').populate({
        path: 'products',
        populate:{
            path: 'productId'
        }
    });
    console.log(order[0].products);
    res.render('sales_staff/manage_orders',{layout: 'sales_staff_layout', order: JSON.parse(JSON.stringify(order))});
}