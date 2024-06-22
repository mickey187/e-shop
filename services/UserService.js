const { default: mongoose } = require("mongoose");
const User = require("../models/User");

const createUser = async (user) => {
  try {
    return await User.create(user);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }

};

const findCustomerByIdService = async(customerId) => {
    try {
      const userId = new mongoose.Types.ObjectId(customerId);
      const user = User.findById(userId);
      if (user) {
        return user;
      }else{
        throw new Error(`No customer found with ID: ${customerId}`)
      }
    } catch (error) {
        console.error("error fetching user: ", error.message);
    }
  };


module.exports = { createUser, findCustomerByIdService };
