const {check, validationResult} = require('express-validator');

exports.validateProductCatagory = [
    check('productCategory').not().isEmpty().withMessage('Product Category is required'),
    check('productSubCategory').not().isEmpty().withMessage('Product Sub Category is required'),
];

exports.validateProductAtribute = [
    check('productAttibuteName').not().isEmpty().withMessage('Product Attribute Name is required'),
    check('productAttributeValue').not().isEmpty().withMessage('Product Attribute Value is required'),
];

exports.validateAddEmployee = [
    check('employeeFirstName').not().isEmpty().withMessage('Product Attribute Name is required'),
    check('employeeLastName').not().isEmpty().withMessage('Product Attribute Name is required'),
    check('employeeUsername').not().isEmpty().withMessage('Product Attribute Name is required'),
    check('employeeEmail', 'Email is required').isEmail(),
    check('employeeRole').not().isEmpty().withMessage('Product Attribute Name is required'),
    check('epmloyeePassword', 'Password is requried')
    .isLength({ min: 8 }).withMessage("password length can not be less than 8 characters")
    .custom((val, { req, loc, path }) => {
        if (val !== req.body.epmloyeeConfirmPassword) {
            throw new Error("Passwords don't match");
        } else {
            return val;
        }
    })
];