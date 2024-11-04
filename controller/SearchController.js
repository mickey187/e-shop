const Product = require('../models/Product');

/**
 * Searches for products by name or tags.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const searchProducts = async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query; // Default pagination settings
  console.log("-----", query);

  try {
    // Ensure the query parameter is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Define the search criteria
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search on name
        { tags: { $regex: query, $options: 'i' } }  // Case-insensitive search on tags array
      ]
    };

    // Use pagination with mongoose-paginate-v2
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 } // Sort by creation date (newest first)
    };

    const products = await Product.paginate(searchCriteria, options);

    // Send the paginated results
    // res.status(200).json(products);
    return res.status(200).json({
        status: "success",
        statusCode: 200,
        data: products,
      });
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
    
  }
};

module.exports = {searchProducts};
