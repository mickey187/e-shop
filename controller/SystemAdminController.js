const session = require('express-session');  // session middleware
const passport = require('passport');
const User = require('../models/User');
const {check, validationResult} = require('express-validator');



exports.dashboard = (req, res)=>{
    console.log(req.user);
    var user = JSON.parse(JSON.stringify(req.user));
    res.render('admin/system_admin_dashboard',{layout: 'system_admin_layout', user: user});
}

exports.manageEmployee = (req, res)=>{

    res.render('admin/manage_employee',{layout: 'system_admin_layout'});
}

exports.addEmployee = async(req, res)=>{

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
           status: "failed",
           message: "Validation error in your request",
           errors: errors.array()});
   } else{
    User.exists({$or: [{email: req.body.employeeEmail}, {username: req.body.employeeUsername}]}, (err, doc)=>{
        if (doc == null) {
            User.register({
                firstName: req.body.employeeFirstName,
                lastName: req.body.employeeLastName,
                username: req.body.employeeUsername,
                email: req.body.employeeEmail,
                role: req.body.employeeRole,
                active: false},
                req.body.epmloyeePassword, 
                (err, newEmployee)=>{
                    console.log(err, "helllllllllllllllllo");
                    if (!err == null) {
                        res.status(500).json({
                            status: "failed",
                            message: "Could not create User",
                        });
                    } else {
                        res.json({
                            status: "success",
                            message: "User created successfully",
                            user: newEmployee
                        });
                    }
                }
                );
        } else {
             res.status(409).json({
                status: "failed",
                message: "User with this email already exists"
            });
        }
    });
   }
}

exports.viewEmployee = async(req, res)=>{

    var employeeDetail = await User.find(
        {$or: [
            {role: "sales_manager"},
            {role: "sales_staff"},
            {role: "system_admin"}
        ]});
    res.json(employeeDetail)
    console.log(employeeDetail);    
}

exports.viewCustomerInfo = async(req, res)=>{

    try {
        var customerData = await User.find({role: 'customer'});
        res.render('admin/manage_customers', {layout: 'system_admin_layout', customerData: JSON.parse(JSON.stringify(customerData))})
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

