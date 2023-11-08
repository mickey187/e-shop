const Product = require("../models/Product");

const createProductService = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }
};

const getAllProductsService = async () => {
  try {
    const products = await Product.find().populate("category attributes");
    return products;
  } catch (error) {
    console.error(`Error creating producs: ${error}`);
    throw new Error(`Error creating producs: ${error.message}`);
  }
};
const getProductByIdService = async (productId) => {
  try {
    const product = await Product.findById(productId).populate(
      "category attributes"
    );
    return product;
  } catch (error) {
    throw new Error(`Error getting producs: ${error.message}`);
  }
};

const updateProductService = async (product) => {
  try {
    const productExists = await Product.findById(product._id);
    if (productExists) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: product._id },
        { $set: product },
        { new: true }
      );
      if (updatedProduct) {
        return updatedProduct;
      }
    }
  } catch (error) {
    throw new Error(`Error getting producs: ${error.message}`);
  }
};

const deleteProductService = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (product) {
      const deletedProduct = await product.softDelete();
      if (deletedProduct) {
        return true;
      }
    }
  } catch (error) {
    throw new Error(`Error getting producs: ${error.message}`);
  }
};

module.exports = {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
};
