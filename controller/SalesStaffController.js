
const Order = require('../models/Order');
exports.salesStaffDashboard = (req, res)=>{

    res.render('sales_staff/sales_staff_dashboard', {layout: 'sales_staff_layout'});
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