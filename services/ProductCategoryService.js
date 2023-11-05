const async = require("async");
const fs = require("fs");
const ProductCategory = require("../models/ProductCategory");
const { uploadFileService } = require("../services/StorageService");

const createProductCategoryService = async (productCategoryData) => {
  try {
    const isDuplicate = checkDuplicate(
      productCategoryData.productCategory,
      productCategoryData.productSubCategory
    );
    if (!isDuplicate) {
      const newProductCategory = new ProductCategory({
        category: productCategoryData.productCategory.toString(),
        subCategory: productCategoryData.productSubCategory.toString(),
      });
      await newProductCategory.save();
      if (newProductCategory) {
        return newProductCategory;
      }
    }
  } catch (error) {
    console.error(`Error Creating Product Category: ${error}`);
    throw new Error(`Error Creating Product Category: ${error.message}`);
  }
};

const getAllProductCategoryService = async () => {
  try {
    const productCategories = await ProductCategory.find().populate("products");
    return productCategories;
  } catch (error) {
    throw new Error(`Error getting all product category: ${error.message}`);
  }
};

const getProductCategoryByIdService = async (productCategoryId) => {
  try {
    const productCategory = await ProductCategory.findById(productCategoryId).populate("products");
    return productCategory;
  } catch (error) {
    throw new Error(`Error getting all product category: ${error.message}`);
  }
};

const updateProductCategoryService = async (productCategory) => {
  try {
    const productCategoryExists = await ProductCategory.findById(
      productCategory._id
    );
    if (productCategoryExists) {
      const isProdutCategoryDuplicate = checkDuplicate(
        productCategory.productCategory,
        productCategory.productSubCategory
      );
      if (!isProdutCategoryDuplicate) {
        const updatedProductCategory = await ProductCategory.findOneAndUpdate(
          { _id: productCategory._id },
          { $set: productCategory },
          { new: true }
        );
        return updatedProductCategory;
      } else {
        throw new Error(`Error updating category: duplicate found`);
      }
    }
  } catch (error) {
    throw new Error(`Error updating product category: ${error.message}`);
  }
};

const deleteProductCategoryService = async (productCategoryId) => {
  try {
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (productCategory) {
     const deletedProductCategory = await productCategory.softDelete();
     if (deletedProductCategory) {
      return true;
    }
    }
    
    
  } catch (error) {
    throw new Error(`Error deleting product category: ${error.message}`);
  }
};

const checkDuplicate = (productCategory, productSubCategory) => {
  ProductCategory.exists({
    category: productCategory,
    subCategory: productSubCategory,
  }).then((exists) => {
    if (exists) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  createProductCategoryService,
  getAllProductCategoryService,
  getProductCategoryByIdService,
  updateProductCategoryService,
  deleteProductCategoryService,
};
