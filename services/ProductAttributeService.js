const ProductAttribute = require("../models/ProductAttribute");

const createProductAttributeService = async (productAttibute) => {
  try {
    const isDuplicate = checkDuplicate(
      productAttibute.productAttibuteName,
      productAttibute.productAttributeValue
    );
    if (!isDuplicate) {
      const newProductAttribute = new ProductAttribute(productAttibute);
      await newProductAttribute.save();

      if (newProductAttribute) {
        return newProductAttribute;
      }
    }
  } catch (error) {
    throw new Error(`Error creating product attribute: ${error.message}`);
  }
};

const getAllProductAttributeService = async () => {
  try {
    const productAttibutes = await ProductAttribute.find();
    return productAttibutes;
  } catch (error) {
    throw new Error(`Error getting product attribute: ${error.message}`);
  }
};
const getProductAttributeByIdService = async (productAttibuteId) => {
  try {
    const productAttibute = await ProductAttribute.findById(productAttibuteId);
    return productAttibute;
    
  } catch (error) {
    throw new Error(`Error getting product attribute: ${error.message}`);
  }
};

const updateProductAttributeService = async (productAttibute) => {
  try {
    const productAttributeExists = await ProductAttribute.findById(
        productAttibute.productAttibuteId
      );
      if (productAttributeExists) {
        const isProdutAttributeDuplicate = checkDuplicate(
            productAttibute.productAttibuteName,
            productAttibute.productAttributeValue
        );
        if (!isProdutAttributeDuplicate) {
          const updatedProductAttibute = await ProductAttribute.findOneAndUpdate(
            { _id: productAttibute.productAttibuteId },
            { $set: productAttibute },
            { new: true }
          );
          return updatedProductAttibute;
        } else {
          throw new Error(`Error updating product Attribute: duplicate found`);
        }
      }
  } catch (error) {
    throw new Error(`Error updating product attribute: ${error.message}`);
  }
};

const deleteProductAttributeService = async(productAttributeId) => {
  try {
    const productAttribute = await ProductAttribute.findById(productAttributeId);
    if (productAttribute) {
     const deletedProductAttibute = await productAttribute.softDelete();
     if (deletedProductAttibute) {
      return true;
    }
  }
} catch (error) {
    throw new Error(`Error ddeleting product attribute: ${error.message}`);
  }
};

const checkDuplicate = (productAttibuteName, productAttributeValue) => {
  ProductAttribute.exists({
    attributeName: productAttibuteName,
    value: productAttributeValue,
  }).then((exists) => {
    if (exists) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  createProductAttributeService,
  getAllProductAttributeService,
  getProductAttributeByIdService,
  updateProductAttributeService,
  deleteProductAttributeService,
};
