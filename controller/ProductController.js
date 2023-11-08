const mongoose = require("mongoose");
var UserData = require("../models/User.js");
var Product = require("../models/Product");
var ProductAttribute = require("../models/ProductAttribute");
var ProductCategory = require("../models/ProductCategory");
const Payment = require("../models/Payment");
var express = require("express");
var router = express.Router();
var session = require("express-session");

var path = require("path");
var fs = require("fs");
const { validationResult } = require("express-validator");
const {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} = require("../services/ProductService.js");
const {
  uploadFileService,
  uploadMultipleFilesService,
} = require("../services/StorageService");
const winstonLogger = require("../utils/Logger");
const ErrorLogService = require("../services/ErrorLogService");
const { extractUserAgent } = require("../utils/ExtractUserAgent");

exports.salesManagerDashboard = async (req, res) => {
  // var user = JSON.parse(JSON.stringify(req.user));
  // console.log();
  var payment = await Payment.find({}).count();
  var product = await Product.find({}).count();
  var newProducts = await Product.find({
    createdAt: { $gt: new Date(Date.now() - 168 * 60 * 60 * 1000) },
  }).count();
  var outOfStockProducts = await Product.find({
    quantity: { $lte: 1 },
  }).count();

  res.render("sales_manager/sales_manager_dashboard", {
    layout: "main",
    payment: payment,
    product: product,
    outOfStockProducts: outOfStockProducts,
    newProducts: newProducts,
  });
};

exports.salesManagerLogout = (req, res) => {
  console.log("testtttttttttttt" + "  ");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

exports.addProductCategory = (req, res) => {
  console.log("req.filessssssss: ", req.files);
  var errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation error in your request",
      errors: errors.array(),
    });
  } else {
    ProductCategory.exists(
      {
        category: req.body.productCategory,
        subCategory: req.body.productSubCategory,
      },
      (err, doc) => {
        var storageLocation = null;
        if (doc == null) {
          var pc = new ProductCategory({
            category: req.body.productCategory.toString(),
            subCategory: req.body.productSubCategory.toString(),
          });

          pc.save((err, doc) => {
            if (!err) {
              req.files.forEach((element) => {
                fs.writeFile(
                  "storage/" + doc._id + "-" + element.originalname,
                  element.buffer,
                  (err) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("File written successfully\n");

                      storageLocation =
                        "storage/" + doc._id + "-" + element.originalname;
                      ProductCategory.findByIdAndUpdate(
                        doc._id,
                        { image: storageLocation },
                        function (err, docs) {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log("Updated ProductCategory : ", docs);
                          }
                        }
                      );
                    }
                  }
                );
              });
              res.json({
                message: "success",
              });
            } else {
              res.status(500).json({
                message: "failed",
              });
              console.log(err);
            }
          });
        } else {
          res.json({
            message:
              "The specified product category and sub category already exists",
          });
        }
      }
    );
  }
};

exports.viewProductCategory = async (req, res) => {
  var result = await ProductCategory.find();
  res.send(result);
  console.log(ProductCategory.find({}));
  //  ProductCategory.findById('62b3189c782e0985aa045d35', function(err, docs){
  //   if(!err){
  //     res.send(docs);
  //   }
  // });

  // console.log(query.select('category'));
  // console.log(query);
};

exports.editProductCategory = async (req, res) => {
  console.log(req.body);
  var updateStatus = await ProductCategory.updateOne(
    { _id: req.body.categoryId },
    { category: req.body.category, subCategory: req.body.subCategory }
  );
  console.log(updateStatus);
  if (updateStatus.acknowledged && updateStatus.modifiedCount > 0) {
    res.json({
      message: "updated",
    });
  } else {
    res.json({
      message: "failed",
    });
  }
};

exports.deleteProductCategory = async (req, res) => {
  var categoryId = req.body.categoryId.toString();
  var deleteStatus = await ProductCategory.deleteOne({
    _id: req.body.categoryId,
  });
  if (deleteStatus.acknowledged && deleteStatus.deletedCount > 0) {
    res.json({
      message: "deleted",
    });
  } else {
    res.json({
      message: "failed",
    });
  }
};

exports.addProductAttribute = (req, res) => {
  var errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation error in your request",
      errors: errors.array(),
    });
  } else {
    ProductAttribute.exists(
      {
        attributeName: req.body.productAttibuteName,
        value: req.body.productAttributeValue,
      },
      (err, doc) => {
        if (doc == null) {
          var pa = new ProductAttribute({
            attributeName: req.body.productAttibuteName,
            value: req.body.productAttributeValue,
          });

          pa.save((err, doc) => {
            if (!err) {
              res.json({
                message: "success",
              });
            } else {
              res.status(500).json({
                message: "erorr",
              });
            }
          });
        } else {
          res.json({
            message:
              "The specified product category and sub category already exists",
          });
        }
      }
    );
  }
};

exports.viewProductAttribute = async (req, res) => {
  var productAttributeList = await ProductAttribute.find({});
  res.send(productAttributeList);
};

exports.fetchProductCategory = async (req, res) => {
  var productCategory = await ProductCategory.find({});
  res.send(productCategory);
};

exports.fetchProductAttribute = async (req, res) => {
  var productAttribute = await ProductAttribute.find({});
  // console.log(productAttribute);
  res.send(productAttribute);
};

// exports.addProduct = (req, res) =>{
// // console.log(req.files);
// // console.log(req.body);
// var product_attribute_list_array =  req.body.product_attribute_list.split(',');
// // var pp = tt.map(s => mongoose.Types.ObjectId(s));
// console.log(product_attribute_list_array);
// var tagsInputArray = [];
// var arr = JSON.parse(req.body.tags_input);

// arr.forEach(element => {
//   tagsInputArray.push(element.value);
//   // console.log(element.value);

// // console.log(tagsInputArray);
// });
//   var product = new Product({
//     name: req.body.product_name,
//     price: req.body.product_price,
//     quantity: req.body.product_quantity,
//     category: req.body.product_category_list,
//     attributes: product_attribute_list_array,
//     tags: tagsInputArray,
//     description: req.body.product_description

//   });

//   product.save( (err, doc)=>{
//     let productImagePathArray = [];
//     if (!err) {

//       req.files.forEach(element => {

//         fs.writeFile("storage/" + doc._id + '-' + element.originalname, element.buffer, (err) => {
//           if (err){
//             console.log(err);
//           }
//           else {
//             console.log("File written successfully\n");
//             productImagePathArray.push("storage/" + doc._id + '-' + element.originalname);
//             console.log(productImagePathArray);

//             Product.findByIdAndUpdate(doc._id,{images: productImagePathArray},function (err, docs) {
//               if (err){
//                   console.log(err)
//               }
//               else{
//                   console.log("Updated Product : ", docs, productImagePathArray);
//               }
//           });

//           }
//         });

//       });
//       console.log(productImagePathArray);

//       res.send("success");

//     }
//     else{
//       console.log(err);
//     }
//   });

// }

exports.viewProduct = async (req, res) => {
  var products = await Product.find({})
    .populate("category")
    .populate("attributes");
  res.send(products);
};

exports.fetchProductById = async (req, res) => {
  var product = await Product.findById(req.params.productId)
    .populate("category")
    .populate("attributes");
  var productCategory = await ProductCategory.find({});
  var productAttribute = await ProductAttribute.find({});
  console.log(product);
  if (product != null) {
    res.json({
      status: true,
      product: product,
      productCategory: productCategory,
      productAttribute: productAttribute,
    });
  } else {
    res.json({
      status: false,
      product: null,
    });
  }
};

exports.seedProduct = (req, res) => {
  // var productCategory = new ProductCategory({
  //     category: 'Home and Kitchen',
  //     subCategory: 'Furniture'
  // });
  // productCategory.save((err, doc)=>{
  //     if(!err){
  //         res.send(doc);
  //         console.log("success");
  //     }
  //     else{
  //         res.send("failed");
  //     }
  // });
};

const addProduct = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const newProduct = await createProductService(req.body);

    const productImages = req.files;
    console.log("productImages", productImages);
    const productImageDestinationPath = path.join("product-image");

    if (newProduct) {
      const productImageStorageStatus = await uploadMultipleFilesService(
        productImageDestinationPath,
        productImages
      );

      if (!productImageStorageStatus.success) {
        throw new Error(`Error uploading product images`);
      }

      const filter = { _id: newProduct._id };
      const update = {
        images: productImageStorageStatus.fileStoragePathsArray,
      };
      const updatedProduct = await Product.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log("Updated product:", updatedProduct);
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        data: updatedProduct,
      });
    } else {
      throw new Error(`Could not create product`);
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const products = await getAllProductsService();
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: products,
    });
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productId = req.params.productId;
    const product = await getProductByIdService(productId);
    return res.status(200).json({
      status: "success",
      statusCode: 200,
      data: product,
    });
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateProductDetail = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productData = req.body;
    const updatedProduct = await updateProductService(productData);
    if (updatedProduct) {
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        data: updatedProduct,
      });
    } else {
      throw new Error(`could not update product`);
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const userAgentInfo = extractUserAgent(req) || null;
  const clientIp = req.ip || null;
  const url = req.originalUrl || null;
  try {
    const productId = req.params.productId;
    const deletedProduct = await deleteProductService(productId);
    if (deletedProduct) {
      return res.status(204).json({
        message: `product  with the id ${productId} was deleted`,
      });
    } else {
      throw new Error(`product with the id ${productId} could not be deleted`);
    }
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    winstonLogger.error(`An error occurred: ${error.message}`);
    await ErrorLogService.logError(error, true, userAgentInfo, clientIp, url);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductDetail,
  deleteProduct,
};
