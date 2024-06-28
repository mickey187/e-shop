const { mongoose } = require("mongoose");
const ProductReview = require("../models/ProductReview");

const createProductReviewService = async (
  customerId,
  productId,
  rating,
  title,
  comment
) => {
  try {
    const review = new ProductReview({
      customerId: new mongoose.Types.ObjectId(customerId),
      productId: new mongoose.Types.ObjectId(productId),
      rating: rating,
      title: title,
      comment: comment,
    }).save();

    return review;
  } catch (error) {
    console.error(`error creating a review: ${error.message}`);
    throw new Error(`error creating a review: ${error.message}`);
  }
};

const fetchReviewsForProductService = async (productId) => {
  try {
    const productIdMongo = new mongoose.Types.ObjectId(productId);
    const reviews = await ProductReview.find({
      productId: productIdMongo,
    }).populate("customerId productId");
    const ratingAnalysis = await calculateProductRatingAverage(productId);
    return { reviews: reviews, ratingAnalysis: ratingAnalysis };
  } catch (error) {
    console.error(`error fecthing a review: ${error.message}`);
    throw new Error(`error fecthing a review: ${error.message}`);
  }
};

const calculateProductRatingAverage = async (productId) => {
  try {
    const productIdMongo = new mongoose.Types.ObjectId(productId);
    const reviews = await ProductReview.find({
      productId: productIdMongo,
    });
    let individualRatingSum = 0;
    let totalRatingCount = 0;

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      individualRatingSum += review.rating;
      totalRatingCount++;

      let rating = review.rating;
      console.log("ssss", rating in ratingDistribution)
      if (rating in ratingDistribution) {
        ratingDistribution[rating] = ratingDistribution[rating] + 1;
      }
    });

    if (individualRatingSum == 0 || totalRatingCount == 0) {
        const result = {
            averageRating: 0,
            ratingDistribution: {
              oneStarRatingPercentage: 0,
              twoStarRatingPercentage: 0,
              threeStarRatingPercentage: 0,
              fourStarRatingPercentage: 0,
              fiveStarRatingPercentage: 0,
            },
          };
      return result;
    } else {
      const averageRating = individualRatingSum / totalRatingCount;
      let oneStarRatingPercentage = ((ratingDistribution[1] / totalRatingCount) * 100).toFixed(2);
      let twoStarRatingPercentage = ((ratingDistribution[2] / totalRatingCount) * 100).toFixed(2);
      let threeStarRatingPercentage = ((ratingDistribution[3] / totalRatingCount) * 100).toFixed(2);
      let fourStarRatingPercentage = ((ratingDistribution[4] / totalRatingCount) * 100).toFixed(2);
      let fiveStarRatingPercentage = ((ratingDistribution[5] / totalRatingCount) * 100).toFixed(2);
      const result = {
        averageRating: averageRating,
        ratingDistribution: {
          oneStarRatingPercentage: oneStarRatingPercentage,
          twoStarRatingPercentage: twoStarRatingPercentage,
          threeStarRatingPercentage: threeStarRatingPercentage,
          fourStarRatingPercentage: fourStarRatingPercentage,
          fiveStarRatingPercentage: fiveStarRatingPercentage,
        },
      };

      return result;
    }
  } catch (error) {
    console.error("error calculating average rating", error.message);
  }
};

module.exports = {
  createProductReviewService,
  fetchReviewsForProductService,
  calculateProductRatingAverage,
};
